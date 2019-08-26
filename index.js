'use-strict';

const { bitnacleFormats, bitnacleTimer } = require('bitnacle-helpers');

class Bitnacle {

    constructor (options) {
        this.options = typeof options === 'object' ? options : {};
        this.format = 'simple';

        if (this.options.format) {
            if (this.options.format === 'extended' || bitnacleFormats[this.options.format] === undefined) {
                throw new Error('Invalid format for Bitnacle, use one of the following: simple or json.');
            }

            this.format = this.options.format;
        }

    }

    log({ level, message, req }) {

        const time = bitnacleTimer.getRequestTime();
        const endpoint = req && (req.originalUrl || req.url);
        const remoteAddress = req && (req.clientIp || req.ip);
        const id = req && req.id;
        const method = req && req.method;

        const logMessageObject = {
            time,
            level,
            req: {
                method,
                endpoint,
                remoteAddress,
                id
            },
            message
        }

        const logMessage = bitnacleFormats[this.format](logMessageObject);

        if (level && (level === 'ERROR' || level === 'WARNING')) {
            process.stderr.write(`${logMessage}\n`);
        } else {
            process.stdout.write(`${logMessage}\n`);
        }
    }

    error(err, req) {
        this.log({
            level: 'ERROR', 
            message: err, 
            req
        });
    }

    warning(message, req) {
        this.log({
            level: 'WARNING', 
            message, 
            req
        });
    }

    info(message, req) {
        this.log({
            level: 'INFO', 
            message, 
            req
        });
    }

    debug(message, req) {
        this.log({
            level: 'DEBUG', 
            message, 
            req
        });
    }

}

module.exports = Bitnacle;