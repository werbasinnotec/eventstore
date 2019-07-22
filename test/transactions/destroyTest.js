'use strict';

const assert = require('assertthat');
const path = require('path');
const ObjectID = require('mongodb').ObjectID;
const events = require(path.resolve('./lib/events'));
const database = require(path.resolve('./lib/database'));
const transactions = require(path.resolve('./lib/transactions'));

describe('transactions.destroy...', () => {
  it('... is of type function', (done) => {
    assert.that(transactions.destroy).is.ofType('function');
    done();
  });

  it('... rejects an error when aggregatId is not defined', (done) => {
    (async () => {
      try {
        await transactions.destroy();
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without a aggregateId');
        done();
      }
    })();
  });

  it('... rejects an error when aggregateId is unknow', (done) => {
    (async () => {
      try {
        await transactions.destroy(new ObjectID());
      } catch (err) {
        assert.that(err).is.equalTo('The called aggregateId is unknow!');
        done();
      }
    })();
  });

  it('... resolves true when process is done', (done) => {
    (async () => {
      try {
        const aggregateId = new ObjectID();

        await events.saveEvent({
          aggregateId, aggregate: 'person', payload: { money: 'honey' }
        });

        const destRes = await transactions.destroy(aggregateId);
        const dataRes = await database.transaction().find({ aggregateId }).toArray();

        assert.that(destRes).is.true();
        assert.that(dataRes.length).is.equalTo(1);
        assert.that(dataRes[0].deleted).is.true();
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
