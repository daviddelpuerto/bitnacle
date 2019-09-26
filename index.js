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

    getRequestPropsFromExtraInfo(extraInfo) {
        if (!extraInfo || !extraInfo.req) return {};

        const { req } = extraInfo;

        if (typeof req !== 'object') {
            throw new Error('extraInfo.req must be an object');
        }

        const method = req && req.method;
        const endpoint = req && (req.originalUrl || req.url);
        const remoteAddress = req && (req.clientIp || req.ip);
        const id = req && req.id;

        return { method, endpoint, remoteAddress, id };
    }

    log({ level, message, extraInfo }) {

        if (extraInfo && typeof extraInfo !== 'object') {
            throw new Error('You must pass an object as "extraInfo" to Bitnacle');
        }

        const time = bitnacleTimer.getRequestTime();

        const req = this.getRequestPropsFromExtraInfo(extraInfo);
        const extra = extraInfo && extraInfo.extra;

        const logMessageObject = {
            time,
            level,
            req,
            extra,
            message
        };

        const logMessage = bitnacleFormats[this.format](logMessageObject);

        if (level && (level === 'ERROR' || level === 'WARNING')) {
            process.stderr.write(`${logMessage}\n`);
        } else {
            process.stdout.write(`${logMessage}\n`);
        }
    }

    error(err, extraInfo) {
        this.log({
            level: 'ERROR', 
            message: err, 
            extraInfo
        });
    }

    warning(message, extraInfo) {
        this.log({
            level: 'WARNING', 
            message, 
            extraInfo
        });
    }

    info(message, extraInfo) {
        this.log({
            level: 'INFO', 
            message, 
            extraInfo
        });
    }

    debug(message, extraInfo) {
        this.log({
            level: 'DEBUG', 
            message, 
            extraInfo
        });
    }

}

module.exports = Bitnacle;