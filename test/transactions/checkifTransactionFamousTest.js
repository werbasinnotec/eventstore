'use strict';

const assert = require('assertthat');
const mdbhandler = require('mongodb-handler');

const checkifTransactionFamous = require('../../lib/transactions/checkifTransactionFamous');

describe('checkifTransactionFamous...', () => {
  it('... is of type function', (done) => {
    assert.that(checkifTransactionFamous).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    checkifTransactionFamous(undefined, (err) => {
      assert.that(err).is.equalTo('aggregateID is not defined');
      done();
    });
  });

  it('... callbacks false when aggregateID is not famous', (done) => {
    checkifTransactionFamous('abc', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.falsy();
      done();
    });
  });

  it('... callbacks true when aggregateID is famous', (done) => {
    mdbhandler.insert({ collection: 'transactions', doc: { aggregateID: 'abc' }}, (err) => {
      if (err) {
        throw err;
      }

      checkifTransactionFamous('abc', (err2, res) => {
        if (err2) {
          throw err2;
        }

        assert.that(res).is.true();
        done();
      });
    });
  });
});
