'use strict';

const assert = require('assertthat');
const mdbhandler = require('mongodb-handler');

const createNewTransaction = require('../../lib/transactions/createNewTransaction');

describe('createNewTransaction...', () => {
  it('... is of type function', (done) => {
    assert.that(createNewTransaction).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    createNewTransaction(undefined, undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... callbacks an error when context is not defined', (done) => {
    createNewTransaction('ABC', undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without context');
      done();
    });
  });

  it('... callbacks an error when aggregateID is already famous in the system', (done) => {
    mdbhandler.insert({ collection: 'transactions', doc: { aggregateID: 'GHI', context: 'person' }}, (err) => {
      if (err) {
        throw err;
      }

      createNewTransaction('GHI', 'person', (err2) => {
        assert.that(err2).is.equalTo('The named aggregateID is already famous in the system');
        done();
      });
    });
  });

  it('... callbacks true when transaction is saved', (done) => {
    createNewTransaction('ABC', 'customer', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();
      done();
    });
  });
});
