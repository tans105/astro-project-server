const winston = require('winston')

dateFormat = () => {
    return new Date(Date.now()).toLocaleString()
}

class LoggingService {
    constructor(route) {
        this.log_data = null
        this.route = route
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: `./logs/${route}.log`
                })
            ],
            format: winston.format.printf((info) => {
                let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `
                message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
                message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
                return message
            })
        })
    }

    async info(message, obj) {
        this.logger.log('info', message, {
            obj
        })
    }

    async debug(message, obj) {
        this.logger.log('debug', message, {
            obj
        })
    }

    async error(message, obj) {
        this.logger.log('error', message, {
            obj
        })
    }
}

const Logger = (app) => {
    return new LoggingService(app);
}

module.exports = Logger