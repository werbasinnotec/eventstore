'use strict';

const assert = require('assertthat');
const mdbhandler = require('mongodb-handler');
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;

const getlastEventbyAggregateId = require('../../lib/events/getlastEventbyAggregateId');

describe('getlastEventbyAggregateId...', () => {
  it('... is of type function', (done) => {
    assert.that(getlastEventbyAggregateId).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    getlastEventbyAggregateId(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... create TestData', (done) => {
    const testdata = [];
    const aggregateID = new ObjectID('584e6be23ace6099b9f02869');

    for (let i = 0; i < 10; i++) {
      testdata.push({ timestamp: moment().unix(), aggregateID, aggregate: 'billing', context: 'customer', revision: i, payload: { foo: 'bar', count: i }});
    }

    mdbhandler.bulk({ collection: 'events', doc: testdata }, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... callbacks the last snapshot by aggregateID', (done) => {
    getlastEventbyAggregateId('584e6be23ace6099b9f02869', (err, result) => {
      if (err) {
        throw err;
      }

      assert.that(result.payload.count).is.equalTo(9);
      assert.that(result.aggregateID.toString()).is.equalTo('584e6be23ace6099b9f02869');
      done();
    });
  });
});
