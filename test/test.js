/* eslint-disable no-unused-expressions */

const fs = require('fs');
const { expect } = require('chai');
const { stdout, stderr } = require('test-console');
const Bitnacle = require('../index');

const LOG_FILE = './test/sample.log';

fs.writeFileSync(LOG_FILE);

const writableStream = fs.createWriteStream(LOG_FILE);

const genericLogger = new Bitnacle();
const loggerWithStreams = new Bitnacle({
  streams: [writableStream],
});

function testConsoleOutput({ output, level, message }) {
  const regEx = new RegExp(`\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}:\\d{3}[+-]\\d{4}\\] \\[${level}\\] \\[${message}\\]\\n`);
  return regEx.test(output[0]);
}

describe('#constructor', () => {
  it('should create a new instance of Bitnacle with default simple format', () => {
    expect(genericLogger).to.be.an.instanceOf(Bitnacle);
    expect(genericLogger.format).to.equal('simple');
  });

  it('should create json logger if json format is specified', () => {
    const logger = new Bitnacle({ format: 'json' });
    expect(logger).to.be.an.instanceOf(Bitnacle);
    expect(logger.format).to.equal('json');
  });

  it('should throw an error if extended or invalid format is provided', () => {
    expect(() => new Bitnacle({ format: 'extended' })).to.throw();
    expect(() => new Bitnacle({ format: 'invalidFormat' })).to.throw();
  });

  it('should throw if options.streams includes non writable streams', () => {
    expect(() => new Bitnacle({
      streams: [
        writableStream,
        'Invalid stream',
      ],
    })).to.throw();
  });

  it('should create a logger if streams are writable streams', () => {
    const logger = new Bitnacle({ streams: [writableStream] });
    expect(logger).to.be.an.instanceOf(Bitnacle);
    expect(logger.streams).to.include(writableStream);
  });
});

describe('#getRequestFromExtraInfo()', () => {
  it('should return an empty object if extraInfo or extraInfo.req are missing', () => {
    expect(genericLogger.getRequestPropsFromExtraInfo())
      .to.be.an.instanceOf(Object)
      .to.be.empty;

    expect(genericLogger.getRequestPropsFromExtraInfo({}))
      .to.be.an.instanceOf(Object)
      .to.be.empty;
  });

  it('should throw if extraInfo.req is not an object', () => {
    expect(() => genericLogger.getRequestPropsFromExtraInfo({ req: 'req' })).to.throw();
  });

  it('should return an object with request info', () => {
    expect(genericLogger.getRequestPropsFromExtraInfo({
      req: { method: 'GET' },
    }))
      .to.be.an.instanceOf(Object)
      .to.have.property('method', 'GET');
  });
});

describe('#log()', () => {
  it('should throw if extra info is passed and it\'s not an object', () => {
    expect(() => genericLogger.log({
      level: 'LEVEL',
      message: 'Test message',
      extraInfo: 'extraInfo',
    })).to.throw();
  });

  it('should log extraInfo.extra', () => {
    const extra1 = 'extra1';
    const extra2 = 'extra2';

    const output = stdout.inspectSync(() => {
      genericLogger.log({
        level: 'LEVEL',
        message: 'Test message',
        extraInfo: {
          extra: {
            extra1,
            extra2,
          },
        },
      });
    });

    expect(output[0])
      .to.include(extra1)
      .to.include(extra2);
  });

  it('should log to stderr', () => {
    const level = 'ERROR';
    const message = 'Error message';

    const output = stderr.inspectSync(() => {
      genericLogger.log({
        level,
        message,
      });
    });

    expect(testConsoleOutput({
      output,
      level,
      message,
    })).to.be.true;
  });

  it('should log with streams', () => {
    const level = 'INFO';
    const message = 'Info message';

    const output = stdout.inspectSync(() => {
      loggerWithStreams.log({
        level,
        message,
      });
    });

    expect(testConsoleOutput({
      output,
      level,
      message,
    })).to.be.true;
  });
});

describe('#error()', () => {
  it('Bitnacle.error should log correct message to process.stderr', () => {
    const level = 'ERROR';
    const message = 'Error message';

    const output = stderr.inspectSync(() => {
      genericLogger[level.toLowerCase()](message);
    });

    expect(testConsoleOutput({
      output,
      level,
      message,
    })).to.be.true;
  });
});

describe('#warning()', () => {
  it('Bitnacle.warning should log correct message to process.out', () => {
    const level = 'WARNING';
    const message = 'Warning message';

    const output = stdout.inspectSync(() => {
      genericLogger[level.toLowerCase()](message);
    });

    expect(testConsoleOutput({
      output,
      level,
      message,
    })).to.be.true;
  });
});

describe('#info()', () => {
  it('Bitnacle.info should log correct message to process.stdout', () => {
    const level = 'INFO';
    const message = 'Info message';

    const output = stdout.inspectSync(() => {
      genericLogger[level.toLowerCase()](message);
    });

    expect(testConsoleOutput({
      output,
      level,
      message,
    })).to.be.true;
  });
});

describe('#debug()', () => {
  it('Bitnacle.debug should log correct message to process.stdout', () => {
    const level = 'DEBUG';
    const message = 'Debug message';

    const output = stdout.inspectSync(() => {
      genericLogger[level.toLowerCase()](message);
    });

    expect(testConsoleOutput({
      output,
      level,
      message,
    })).to.be.true;
  });
});
