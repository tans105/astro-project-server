const nodemailer = require('nodemailer');
const common = require('../utils/common')
const templateService = require('./template.service')

module.exports = {
    sendEmail: function (req, res, cb) {
        const config = common.config();
        let emailConfig = {
            email: ''
        };

        if (config) {
            emailConfig = config.email;
        } else {
            cb({success: false, msg: 'Failed to send email: Configuration not found'}, res);
            return;
        }

        const transporter = nodemailer.createTransport({
                service: emailConfig.service,
                auth: {
                    user: emailConfig.user,
                    pass: emailConfig.pass
                }
            }),
            data = req.body;

        const emailPayload = templateService.getTemplate(data);

        const mailOptions = {
            from: emailConfig.from,
            to: emailConfig.to,
            cc: (emailConfig.cc && emailConfig.cc.length > 0) ? emailConfig.cc[0] : null,
            subject: emailPayload.subject,
            html: emailPayload.body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                cb({success: false, msg: 'Failed to send email: ' + error}, res);
            } else {
                cb({success: true, msg: 'Updated successfully: ' + info.message}, res);
            }
        });
    }
};
