'use strict';

const assert = require('assertthat');
const path = require('path');
const transactions = require(path.resolve('lib/transactions'));

describe('transactions.createOrUpdate...', () => {
  it('... is of type function', (done) => {
    assert.that(transactions.createOrUpdate).is.ofType('function');
    done();
  });

  it('... rejects an error when object is not defined', (done) => {
    (async () => {
      try {
        await transactions.createOrUpdate();
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without or incomplete transaction object');
        done();
      }
    })();
  });

  it('... resolves true when process is done (unknow transaction)', (done) => {
    (async () => {
      try {
        const aggregateId = '5b97601835676f3f2026a006';
        const res = await transactions.createOrUpdate({
          aggregateId,
          aggregate: 'person',
          context: 'foo'
        });

        assert.that(res).is.true();

        const trans = await transactions.getTransactionByAggregateId(aggregateId);

        assert.that(trans.aggregate).is.equalTo('person');
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
