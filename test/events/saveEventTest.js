'use strict';

const assert = require('assertthat');
const path = require('path');
const events = require(path.resolve('./lib/events'));

describe('events.saveEvent...', () => {
  it('... is of type function', (done) => {
    assert.that(events.saveEvent).is.ofType('function');
    done();
  });

  it('... rejects an error when object is not complete', (done) => {
    (async () => {
      try {
        await events.saveEvent();
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without complete information');
        done();
      }
    })();
  });

  it('... resolves the revision when process is done', (done) => {
    (async () => {
      try {
        const res = await events.saveEvent({
          aggregateId: '5d305ea072a5bd14971b54ad',
          aggregate: 'person',
          context: 'personservice',
          payload: {
            foo: 'bar'
          }
        });

        assert.that(res.revision).is.equalTo(0);
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  it('... resolves the next revision when process is done', (done) => {
    (async () => {
      try {
        const res = await events.saveEvent({
          aggregateId: '5d305ea072a5bd14971b54ad',
          aggregate: 'person',
          context: 'personservice',
          payload: {
            foo: 'bar',
            bar: 'foo'
          }
        });

        assert.that(res.revision).is.equalTo(1);
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  it('... resolves the third revision when process is done', (done) => {
    (async () => {
      try {
        const res = await events.saveEvent({
          aggregateId: '5d305ea072a5bd14971b54ad',
          aggregate: 'person',
          context: 'personservice',
          payload: {
            foo: 'bar',
            bar: 'foo',
            werbas: 'AG'
          }
        });

        assert.that(res.revision).is.equalTo(2);
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
