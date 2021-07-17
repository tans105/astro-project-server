const nodemailer = require('nodemailer');
const common = require('../utils/common')
const TemplateService = require('./template.service')

module.exports = {
    sendEmail: async function (payload) {
        const config = common.config();
        let emailConfig = {
            email: ''
        };

        if (config) {
            emailConfig = config.email;
        } else {
            throw new Error('Failed to send email: Configuration not found');
        }

        const transporter = nodemailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass
            }
        });

        const emailPayload = TemplateService.getTemplate(payload);

        if(emailPayload) {
            const mailOptions = {
                from: emailConfig.from,
                to: emailConfig.to,
                subject: emailPayload.subject,
                html: emailPayload.body
            };

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    throw new Error(error);
                } else {
                    return {success: true, msg: 'Updated successfully: ' + info.message};
                }
            });
        }
    }
};
