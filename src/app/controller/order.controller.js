const express = require('express');
const crypto = require('crypto');
const _ = require('lodash');

const Logger = require('../service/logging.service')('order.controller');
const common = require('../utils/common')
const DatabaseService = require("../service/database.service");
const router = express.Router();

router.post('/make', function (req, res) {
    DatabaseService.store(req, (dbResponse) => {
        Logger.info('DB operation completed successfully.. initiating payment');
        const instance = common.gatewayInstance();
        const {amount, paymentEnabled} = req.body;

        if(!paymentEnabled) {
            Logger.info('Success [Without payment]' + dbResponse.id);
            res.status(200).json({
                uuid: dbResponse.id,
                status: "ok",
            })
            return;
        }

        const options = {
            amount: parseInt(amount) * 100,
            currency: 'INR',
            receipt: dbResponse.id,
            payment_capture: 0,
        }

        instance.orders.create(options, (err, order) => {
            if (err) {
                Logger.error('error', err);
                res.status(500).send(err);
            }

            if (order) {
                Logger.info('Payment initiated for' + dbResponse.id);
                DatabaseService.storeTransaction(dbResponse.id)
                    .then(() => {
                        Logger.info('Payment initiation success ' + dbResponse.id);
                        res.status(200).json({
                            uuid: dbResponse.id,
                            status: "ok",
                            value: order,
                            key: _.get(require('../utils/common').config(), 'payment.key_id', "")
                        })
                    })
                    .catch(err => res.status(500).send(err))
            }
        })
    })
});

router.post('/verify', function (req, res) {
    const {
        user,
        gateway,
    } = req.body;

    const {
        uuid,
        order_id
    } = user;

    const paymentSuccess = verifyPayment(order_id, gateway);

    if (paymentSuccess) {
        DatabaseService.updateTransaction(uuid, 'SUCCESS')
            .then(() => {
                Logger.info('Payment success updated ' + uuid);
                res.status(200).json({
                    uuid,
                    status: 'SUCCESS',
                    gateway,
                })
            })
            .catch(err => res.status(500).send(err));
    } else {
        DatabaseService.updateTransaction(uuid, 'FAILURE')
            .then(()=> {
                Logger.info('Payment fail updated ' + uuid);
                res.status(500).send('Payment information is not right ')
            })
    }
});


const verifyPayment = (order_id, paymentResponse) => {
    Logger.info('Verifying payment for ' + order_id);
    const payment = JSON.parse(common.getDbConfig('payment'));
    const secret = _.get(payment, 'key_secret', null);
    if (secret) {
        let generatedSignature = crypto.createHmac('sha256', secret).update(order_id + "|" + paymentResponse.razorpay_payment_id).digest('hex')
        return generatedSignature === paymentResponse.razorpay_signature;
    } else {
        return false;
    }
}

module.exports = router;