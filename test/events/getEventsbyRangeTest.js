'use strict';

const assert = require('assertthat');
const ObjectID = require('mongodb').ObjectID;
const path = require('path');
const database = require(path.resolve('./lib/database'));
const events = require(path.resolve('./lib/events'));
const moment = require('moment');

describe('getEventsByRange...', () => {
  it('... is of type function', (done) => {
    assert.that(events.getEventsByRange).is.ofType('function');
    done();
  });

  it('... rejects an error when aggregateId is not defined', (done) => {
    (async () => {
      try {
        await events.getEventsByRange();
      } catch (err) {
        assert.that(err).is.equalTo('Function is called withot a aggregateId');
        done();
      }
    })();
  });

  it('... rejects an error when min is not defined', (done) => {
    (async () => {
      try {
        await events.getEventsByRange('abc');
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without min value or value is not a ISO 8601 timestamp');
        done();
      }
    })();
  });

  it('... rejects an error when min is not a ISO 8601 timestamp', (done) => {
    (async () => {
      try {
        await events.getEventsByRange('abc', '123');
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without min value or value is not a ISO 8601 timestamp');
        done();
      }
    })();
  });

  it('... rejects an error when max is not a defined', (done) => {
    (async () => {
      try {
        await events.getEventsByRange('abc', moment().toISOString());
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without max value or value is not a ISO 8601 timestamp');
        done();
      }
    })();
  });

  it('... rejects an error when max is not a a ISO 8601 timestamp', (done) => {
    (async () => {
      try {
        await events.getEventsByRange('abc', moment().toISOString(), '123x');
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without max value or value is not a ISO 8601 timestamp');
        done();
      }
    })();
  });

  it('... rejects an error when min value is greater than the max value', (done) => {
    (async () => {
      try {
        await events.getEventsByRange('abc', moment().add(3, 'd').toISOString(), moment().toISOString());
      } catch (err) {
        assert.that(err).is.equalTo('Function is called with a greater max value as min value. We are not in movie "Back to future" :-)');
        done();
      }
    })();
  });

  it('... must collect the correct events from the database', (done) => {
    (async () => {
      try {
        const aggregateId = new ObjectID();

        await database.event().insertMany([
          { aggregateId, timestamp: moment().subtract(3, 'y').subtract(4, 'h').toISOString(), payload: { foo: 'bar' }},
          { aggregateId, timestamp: moment().subtract(3, 'y').subtract(3, 'h').toISOString(), payload: { foo: 'bar1' }},
          { aggregateId, timestamp: moment().subtract(3, 'y').subtract(2, 'h').toISOString(), payload: { foo: 'bar2' }},
          { aggregateId, timestamp: moment().subtract(3, 'y').subtract(1, 'h').toISOString(), payload: { foo: 'bar3' }}
        ]);

        const res = await events.getEventsByRange(aggregateId, moment().subtract(3, 'y').subtract(3.5, 'h').toISOString(), moment().subtract(3, 'y').subtract(2, 'h').toISOString());

        assert.that(res.length).is.equalTo(2);
        assert.that(res[0].payload.foo).is.equalTo('bar1');
        assert.that(res[1].payload.foo).is.equalTo('bar2');
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
