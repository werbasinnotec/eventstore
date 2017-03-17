'use strict';

const assert = require('assertthat');
const mdbhandler = require('mongodb-handler');
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;

const getLastSnapshotByAggregateID = require('../../lib/snapshots/getLastSnapshotByAggregateID');

describe('getLastSnapshotByAggregateID...', () => {
  it('... is of type function', (done) => {
    assert.that(getLastSnapshotByAggregateID).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    getLastSnapshotByAggregateID(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... create TestData', (done) => {
    const testdata = [];
    const aggregateID = new ObjectID('58ca7134e872cb274a3bc163');

    for (let i = 0; i < 10; i++) {
      testdata.push({ timestamp: moment().unix(), aggregateID, lastEventID: 'TEST', payload: { foo: 'bar', count: i }});
    }

    mdbhandler.bulk({ collection: 'snapshots', doc: testdata }, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... callbacks the last snapshot by aggregateID', (done) => {
    getLastSnapshotByAggregateID('58ca7134e872cb274a3bc163', (err, result) => {
      if (err) {
        throw err;
      }

      assert.that(result.payload.count).is.equalTo(9);
      assert.that(result.aggregateID.toString()).is.equalTo('58ca7134e872cb274a3bc163');
      done();
    });
  });
});
