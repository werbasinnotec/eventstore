'use strict';

const assert = require('assertthat');
const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const getNextRevisionByAggregateId = require('../../lib/events/getNextRevisionByAggregateId');

describe('getNextRevisionByAggregateId...', () => {
  it('... is of type function', (done) => {
    assert.that(getNextRevisionByAggregateId).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    getNextRevisionByAggregateId(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... create TestData', (done) => {
    const testdata = [];
    const aggregateID = new ObjectID('58ca9c945445f12eb467beae');

    for (let i = 0; i < 10; i++) {
      testdata.push({ timestamp: 1489673364, aggregateID, aggregate: 'billing', context: 'person', revision: i, payload: { foo: 'bar', count: i }});
    }

    mdbhandler.bulk({ collection: 'events', doc: testdata }, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... must callback the correct revision number of the aggregateId', (done) => {
    getNextRevisionByAggregateId('58ca9c945445f12eb467beae', (err, revision) => {
      if (err) {
        throw err;
      }

      assert.that(revision).is.equalTo(10);
      done();
    });
  });

  it('... must callback 0 when a snapshot is created after the events', (done) => {
    const aggregateID = new ObjectID('58ca9c945445f12eb467beae');

    mdbhandler.insert({ collection: 'snapshots', doc: { timestamp: 1489673374, aggregateID, payload: { foo: 'bar', count: 55 }}}, (err) => {
      if (err) {
        throw err;
      }

      getNextRevisionByAggregateId('58ca9c945445f12eb467beae', (err2, revision) => {
        if (err2) {
          throw err2;
        }

        assert.that(revision).is.equalTo(0);
        done();
      });
    });
  });

  it('... create TestData again', (done) => {
    const testdata = [];
    const aggregateID = new ObjectID('58ca9c945445f12eb467beae');

    for (let i = 0; i < 30; i++) {
      testdata.push({ timestamp: 1489673394, aggregateID, aggregate: 'billing', context: 'person', revision: i, payload: { foo: 'bar', count: i }});
    }

    mdbhandler.bulk({ collection: 'events', doc: testdata }, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... must callback the correct revision number of the aggregateId again with more snapshots', (done) => {
    getNextRevisionByAggregateId('58ca9c945445f12eb467beae', (err, revision) => {
      if (err) {
        throw err;
      }

      assert.that(revision).is.equalTo(30);
      done();
    });
  });
});
