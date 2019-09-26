const { expect } = require('chai');
const Bitnacle = require('../index');

describe('#constructor', function() {
    it('should create a new instance of Bitnacle with default simple format', function() {
        const logger = new Bitnacle();
        expect(logger).to.be.an.instanceOf(Bitnacle);
        expect(logger.format).to.equal('simple');
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
});

describe('#getRequestFromExtraInfo()', function() {
    const logger = new Bitnacle();

    it('should return an empty object if extraInfo or extraInfo.req are missing', function() {
        expect(logger.getRequestPropsFromExtraInfo()).to.be.an.instanceOf(Object).to.be.empty;
        expect(logger.getRequestPropsFromExtraInfo({})).to.be.an.instanceOf(Object).to.be.empty;
    });

    it('should throw if extraInfo.req is not an object', function() {
        expect(() => logger.getRequestPropsFromExtraInfo({ req: 'req' })).to.throw();
    });

    it('should return an object with request info', function() {
        expect(logger.getRequestPropsFromExtraInfo({
            req: { method: 'GET' }
        })).to.be.an.instanceOf(Object).to.have.property('method', 'GET');
    });
});