'use strict';

const assert = require('assertthat');
const path = require('path');

const transactions = require(path.resolve('./lib/transactions'));

describe('transactions.getTransactionByAggregateId...', () => {
  it('... is of type function', (done) => {
    assert.that(transactions.getTransactionByAggregateId).is.ofType('function');
    done();
  });

  it('... rejects an error when no aggregateId is defined', (done) => {
    (async () => {
      try {
        await transactions.getTransactionByAggregateId();
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without an aggregateId');
        done();
      }
    })();
  });

  it('... resolve false when no transaction is present in database', (done) => {
    (async () => {
      try {
        const res = await transactions.getTransactionByAggregateId('5d1e090c72b2d803ed92321a');

        assert.that(res).is.false();
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  it('... resolve the transaction when is present', (done) => {
    (async () => {
      try {
        await transactions.createOrUpdate({
          aggregateId: '5d1e090c72b2d803ed92321a',
          aggregate: 'foo',
          context: 'bar'
        });

        const res = await transactions.getTransactionByAggregateId('5d1e090c72b2d803ed92321a');

        assert.that(res).is.not.undefined();
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
