'use strict';

const assert = require('assertthat');
const createSnapshotByAggregateID = require('../../lib/snapshots/createSnapshotByAggregateID');
const getAllActualEvents = require('../../lib/events/getAllActualEvents');
const saveEvent = require('../../lib/events/saveEvent');

describe('getAllActualEvents...', () => {
  it('... is of type function', (done) => {
    assert.that(getAllActualEvents).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    getAllActualEvents(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... create Testdata', (done) => {
    const aggregateID = '58c7cabe58c3b54cf2b56f3c';

    saveEvent({ aggregateID, aggregate: 'directory', context: 'm2msystems', payload: { foo: 'bar' }}, (err) => {
      if (err) {
        throw err;
      }

      saveEvent({ aggregateID, aggregate: 'directory', context: 'm2msystems', payload: { foo: 'bar' }}, (err2) => {
        if (err2) {
          throw err2;
        }

        done();
      });
    });
  });

  it('... must callback the correct events', (done) => {
    getAllActualEvents('58c7cabe58c3b54cf2b56f3c', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res.length).is.equalTo(2);
      done();
    });
  });

  it('... creat snapshot for the following tests', (done) => {
    createSnapshotByAggregateID('58c7cabe58c3b54cf2b56f3c', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();
      done();
    });
  });

  it('... create Testdata again', (done) => {
    const aggregateID = '58c7cabe58c3b54cf2b56f3c';

    saveEvent({ aggregateID, aggregate: 'directory', context: 'm2msystems', payload: { foo: 'barbie' }}, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... must response the correct eventslist', (done) => {
    getAllActualEvents('58c7cabe58c3b54cf2b56f3c', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res.length).is.equalTo(1);
      done();
    });
  });
});
