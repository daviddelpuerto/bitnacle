'use-strict';

const {
  bitnacleLevels, bitnacleFormats, bitnacleTimer, bitnacleUtils,
} = require('bitnacle-helpers');

class Bitnacle {
  constructor(options) {
    this.options = typeof options === 'object' ? options : {};
    this.format = 'simple';

    if (this.options.format) {
      if (this.options.format === 'extended' || bitnacleFormats[this.options.format] === undefined) {
        throw new Error('Invalid format for Bitnacle, use one of the following: simple or json.');
      }

      this.format = this.options.format;
    }

    if (this.options.streams && this.options.streams.length) {
      this.streams = this.options.streams.map((appStream, index) => {
        if (bitnacleUtils.isWritableStream(appStream)) return appStream;
        throw new Error(`stream[${index}] is not a writable stream\n`);
      });
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

    return {
      method, endpoint, remoteAddress, id,
    };
  }

  log({ level, message, extraInfo }) {
    if (extraInfo && typeof extraInfo !== 'object') {
      throw new Error('You must pass an object as "extraInfo" to Bitnacle');
    }

    const messageToLog = message.message || message;

    const time = bitnacleTimer.getRequestTime();

    const req = this.getRequestPropsFromExtraInfo(extraInfo);
    const extra = extraInfo && extraInfo.extra;

    const logMessageObject = {
      time,
      level,
      req,
      extra,
      message: messageToLog,
    };

    const logMessage = `${bitnacleFormats[this.format](logMessageObject)}\n`;

    if (level && (level === bitnacleLevels.levels.ERROR)) {
      process.stderr.write(logMessage);
    } else {
      process.stdout.write(logMessage);
    }

    if (this.streams) {
      this.streams.forEach((stream) => {
        stream.write(logMessage);
      });
    }
  }

  error(err, extraInfo) {
    this.log({
      level: bitnacleLevels.levels.ERROR,
      message: err,
      extraInfo,
    });
  }

  warning(message, extraInfo) {
    this.log({
      level: bitnacleLevels.levels.WARNING,
      message,
      extraInfo,
    });
  }

  info(message, extraInfo) {
    this.log({
      level: bitnacleLevels.levels.INFO,
      message,
      extraInfo,
    });
  }

  debug(message, extraInfo) {
    this.log({
      level: bitnacleLevels.levels.DEBUG,
      message,
      extraInfo,
    });
  }
}

module.exports = Bitnacle;
