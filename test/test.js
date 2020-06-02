const { expect } = require('chai');
const { stdout, stderr } = require('test-console');
const Bitnacle = require('../index');
const fs = require('fs');

fs.writeFileSync('./sample.log');
const writableStream = fs.createWriteStream('./sample.log');

const genericLogger = new Bitnacle();
const loggerWithStreams = new Bitnacle({
    streams: [ writableStream ]
});

function testConsoleOutput({ output, level, message }) {
    const regEx = new RegExp(`\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}:\\d{3}[+-]\\d{4}\\] \\[${level}\\] \\[${message}\\]\\n`);
    return regEx.test(output[0]);
};

describe('#constructor', function() {
    it('should create a new instance of Bitnacle with default simple format', function() {
        expect(genericLogger).to.be.an.instanceOf(Bitnacle);
        expect(genericLogger.format).to.equal('simple');
    });

    it('should create json logger if json format is specified', function() {
        const logger = new Bitnacle({ format: 'json' });
        expect(logger).to.be.an.instanceOf(Bitnacle);
        expect(logger.format).to.equal('json');
    });

    it('should throw an error if extended or invalid format is provided', function() {
        expect(() => new Bitnacle({ format: 'extended' })).to.throw();
        expect(() => new Bitnacle({ format: 'invalidFormat' })).to.throw();
    });

    it('should throw if options.streams includes non writable streams', function() {
        expect(() => new Bitnacle({
            streams: [
                writableStream,
                'Invalid stream'
            ]
        })).to.throw();
    });

    it('should create a logger if streams are writable streams', function() {
        const logger = new Bitnacle({ streams: [ writableStream ] });
        expect(logger).to.be.an.instanceOf(Bitnacle);
        expect(logger.streams).to.include(writableStream);
    });

});

describe('#getRequestFromExtraInfo()', function() {
    it('should return an empty object if extraInfo or extraInfo.req are missing', function() {
        expect(genericLogger.getRequestPropsFromExtraInfo())
            .to.be.an.instanceOf(Object)
            .to.be.empty;
            
        expect(genericLogger.getRequestPropsFromExtraInfo({}))
            .to.be.an.instanceOf(Object)
            .to.be.empty;
    });

    it('should throw if extraInfo.req is not an object', function() {
        expect(() => genericLogger.getRequestPropsFromExtraInfo({ req: 'req' })).to.throw();
    });

    it('should return an object with request info', function() {
        expect(genericLogger.getRequestPropsFromExtraInfo({
            req: { method: 'GET' }
        }))
        .to.be.an.instanceOf(Object)
        .to.have.property('method', 'GET');
    });
});

describe('#log()', function() {
    it(`should throw if extra info is passed and it's not an object`, function() {
        expect(() => genericLogger.log({
            level: 'LEVEL',
            message: 'Test message',
            extraInfo: 'extraInfo'
        })).to.throw();
    });

    it('should log extraInfo.extra', function() {
        const extra1 = 'extra1';
        const extra2 = 'extra2';

        const output = stdout.inspectSync(function() {
            genericLogger.log({
                level: 'LEVEL',
                message: 'Test message',
                extraInfo: {
                    extra: {
                        extra1,
                        extra2
                    }
                }
            });
        });

        expect(output[0])
            .to.include(extra1)
            .to.include(extra2);
    });

    it('should log to stderr', function() {
        const level = 'ERROR';
        const message = 'Error message';
     
        const output = stderr.inspectSync(function() {
            genericLogger.log({
                level,
                message,
            });
        });

        expect(testConsoleOutput({
            output,
            level,
            message
        })).to.be.true;
    });

    it('should log with streams', function() {
        const level = 'INFO';
        const message = 'Info message';
     
        const output = stdout.inspectSync(function() {
            loggerWithStreams.log({
                level,
                message,
            });
        });

        expect(testConsoleOutput({
            output,
            level,
            message
        })).to.be.true;
    });

});

describe('#error()', function() {
    it('Bitnacle.error should log correct message to process.stderr', function() {
        const level = 'ERROR';
        const message = 'Error message';

        const output = stderr.inspectSync(function() {
            genericLogger[level.toLowerCase()](message);
        });

        expect(testConsoleOutput({
            output,
            level, 
            message
        })).to.be.true;
    });
});

describe('#warning()', function() {
    it('Bitnacle.warning should log correct message to process.out', function() {
        const level = 'WARNING';
        const message = 'Warning message';

        const output = stdout.inspectSync(function() {
            genericLogger[level.toLowerCase()](message);
        });

        expect(testConsoleOutput({
            output,
            level, 
            message
        })).to.be.true;
    });
});

describe('#info()', function() {
    it('Bitnacle.info should log correct message to process.stdout', function() {
        const level = 'INFO';
        const message = 'Info message';

        const output = stdout.inspectSync(function() {
            genericLogger[level.toLowerCase()](message);
        });

        expect(testConsoleOutput({
            output,
            level, 
            message
        })).to.be.true;
    });
});

describe('#debug()', function() {
    it('Bitnacle.debug should log correct message to process.stdout', function() {
        const level = 'DEBUG';
        const message = 'Debug message';

        const output = stdout.inspectSync(function() {
            genericLogger[level.toLowerCase()](message);
        });

        expect(testConsoleOutput({
            output,
            level, 
            message
        })).to.be.true; 
    });
});