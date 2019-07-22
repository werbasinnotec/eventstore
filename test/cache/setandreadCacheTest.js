'use strict';

const assert = require('assertthat');
const cache = require('../../lib/cache');

describe('cache.read...', () => {
  it('... is of type function', (done) => {
    assert.that(cache.read).is.ofType('function');
    done();
  });

  it('... throws an error when key is not defined', (done) => {
    assert.that(() => {
      cache.read();
    }).is.throwing('Function is called without key');

    done();
  });

  it('... returns the stored value by a key', (done) => {
    assert.that(cache.set('Test', '123')).is.true();
    assert.that(cache.read('Test')).is.equalTo('123');

    done();
  });
});

describe('cache.set...', () => {
  it('... is of type function', (done) => {
    assert.that(cache.set).is.ofType('function');
    done();
  });

  it('... throws an error when key is not defined', (done) => {
    assert.that(() => {
      cache.set(undefined, undefined);
    }).is.throwing('Function is called without key');

    done();
  });

  it('... throws an error when value is not defined', (done) => {
    assert.that(() => {
      cache.set('ABC', undefined);
    }).is.throwing('Function is called without value');

    done();
  });

  it('... returns true when value is stored by a key', (done) => {
    assert.that(cache.set('FOO', 'BAR')).is.true();

    done();
  });
});
