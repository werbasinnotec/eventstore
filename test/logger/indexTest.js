'use strict';

const assert = require('assertthat');
const path = require('path');
const logger = require(path.resolve('./lib/logger'));

describe('logger...', () => {
  it('... is of type object', (done) => {
    assert.that(logger).is.ofType('object');
    done();
  });

  it('... logger.info is of type function', (done) => {
    assert.that(logger.info).is.ofType('function');
    done();
  });

  it('... logger.debug is of type function', (done) => {
    assert.that(logger.debug).is.ofType('function');
    done();
  });

  it('... logger.error is of type function', (done) => {
    assert.that(logger.error).is.ofType('function');
    done();
  });

  it('... logger.fatal is of type function', (done) => {
    assert.that(logger.fatal).is.ofType('function');
    done();
  });
});
