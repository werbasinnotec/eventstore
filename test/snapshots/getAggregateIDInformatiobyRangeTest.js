'use strict';

const assert = require('assertthat');
const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const createSnapshotByAggregateID = require('../../lib/snapshots/createSnapshotByAggregateID');
const getAggregateIDInformationbyRange = require('../../lib/snapshots/getAggregateIDInformationbyRange');

describe('getAggregateIDInformationbyRange...', () => {
  it('... is of type function', (done) => {
    assert.that(getAggregateIDInformationbyRange).is.ofType('function');
    done();
  });

  it('... callbacks an error when AggregateID is not defined', (done) => {
    getAggregateIDInformationbyRange(undefined, undefined, undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... callbacks an error when min is not defined', (done) => {
    getAggregateIDInformationbyRange('ABC', undefined, undefined, (err) => {
      assert.that(err).is.equalTo('Error in typof min parameter. Parameter is missing or in not correct format');
      done();
    });
  });

  it('... callbacks an error when min is not in correct format number', (done) => {
    getAggregateIDInformationbyRange('ABC', 'ABC', undefined, (err) => {
      assert.that(err).is.equalTo('Error in typof min parameter. Parameter is missing or in not correct format');
      done();
    });
  });

  it('... callbacks an error when max is not defined', (done) => {
    getAggregateIDInformationbyRange('ABC', 1, undefined, (err) => {
      assert.that(err).is.equalTo('Error in typof min parameter. Parameter is missing or in not correct format');
      done();
    });
  });

  it('... callbacks an error when max is not in correct format number', (done) => {
    getAggregateIDInformationbyRange('ABC', 1, 'ABC', (err) => {
      assert.that(err).is.equalTo('Error in typof min parameter. Parameter is missing or in not correct format');
      done();
    });
  });

  it('... callbacks an error when min is greater as the max parameter', (done) => {
    getAggregateIDInformationbyRange('ABC', 10, 9, (err) => {
      assert.that(err).is.equalTo('Error in definition of the range. The min parameter is greater as than max');
      done();
    });
  });

  it('... create Testdata', (done) => {
    const aggregateID = new ObjectID('58c7cac858c3b54cf2b56f53');

    const data = [
      { aggregateID, aggregate: 'testModule', context: 'test', revision: 0, timestamp: 1490015065, payload: { foo: 'bar', balance: 10 }},
      { aggregateID, aggregate: 'testModule', context: 'test', revision: 1, timestamp: 1490016065, payload: { bar: 'Barbie', balance: 1 }},
      { aggregateID, aggregate: 'testModule', context: 'test', revision: 2, timestamp: 1490017065, payload: { barbie: 'pocket', balance: -5 }},
      { aggregateID, aggregate: 'testModule', context: 'test', revision: 3, timestamp: 1490018065, payload: { packet: 'bag' }},
      { aggregateID, aggregate: 'testModule', context: 'test', revision: 4, timestamp: 1490019065, payload: { bag: 'cool' }},
      { aggregateID, aggregate: 'testModule', context: 'test', revision: 5, timestamp: 1490019065, payload: { bag: undefined }}
    ];

    mdbhandler.bulk({ collection: 'events', doc: data }, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... callbacks the correct object', (done) => {
    getAggregateIDInformationbyRange('58c7cac858c3b54cf2b56f53', 1490015065, 1490019065, (err, res) => {
      if (err) {
        throw err;
      }

     assert.that(res.payload).is.equalTo({ foo: 'bar', balance: 6, bar: 'Barbie', barbie: 'pocket', packet: 'bag', bag: null });
     assert.that(res.eventslist.length).is.equalTo(6);
     done();
    });
  });

  it('... callbacks the correct object when in range', (done) => {
    getAggregateIDInformationbyRange('58c7cac858c3b54cf2b56f53', 1490016065, 1490018065, (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res.payload).is.equalTo({ foo: 'bar', balance: 6, bar: 'Barbie', barbie: 'pocket', packet: 'bag' });
      assert.that(res.eventslist.length).is.equalTo(3);
      done();
    });
  });

  it('... create a snapShot for this event', (done) => {
    createSnapshotByAggregateID('58c7cac858c3b54cf2b56f53', (err) => {
      if (err) {
        throw err;
      }

      const aggregateID = new ObjectID('58c7cac858c3b54cf2b56f53');

      const data = [
        { aggregateID, aggregate: 'testModule', context: 'test', revision: 0, timestamp: 1490025065, payload: { balance: 120 }},
        { aggregateID, aggregate: 'testModule', context: 'test', revision: 1, timestamp: 1490026065, payload: { balance: -40 }}
      ];

      mdbhandler.bulk({ collection: 'events', doc: data }, (err2) => {
        if (err2) {
          throw err2;
        }

        done();
      });
    });
  });

  it('... callbacks the correct object when in range', (done) => {
    getAggregateIDInformationbyRange('58c7cac858c3b54cf2b56f53', 1490025065, 1490026065, (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res.payload).is.equalTo({ foo: 'bar', balance: 86, bar: 'Barbie', barbie: 'pocket', packet: 'bag', bag: null });
      assert.that(res.eventslist.length).is.equalTo(2);
      done();
    });
  });
});
