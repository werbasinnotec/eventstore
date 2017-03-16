'use strict';

const assert = require('assertthat');
const saveEvent = require('../../lib/events/saveEvent');

describe('saveEvent...', () => {
  it('... is of type function', (done) => {
    assert.that(saveEvent).is.ofType('function');
    done();
  });

  it('... callbacks an error when obj is not defined', (done) => {
    saveEvent(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without data-object');
      done();
    });
  });

  it('... callbacks an error when no aggreagateID is defined in the object', (done) => {
    saveEvent({}, (err) => {
      assert.that(err).is.equalTo('Function is called without aggreagateID');
      done();
    });
  });

  it('... callbacks an error when no aggreagateID is defined in the object', (done) => {
    saveEvent({ aggregateID: 'ABC' }, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregate');
      done();
    });
  });

  it('... callbacks an error when no payload is defined in the object', (done) => {
    saveEvent({ aggregateID: 'ABC', aggregate: 'billing' }, (err) => {
      assert.that(err).is.equalTo('Function is called without payload');
      done();
    });
  });

  it('... callbacks true when event is saved', (done) => {
    saveEvent({ aggregateID: 'DEE', aggregate: 'billing', context: 'active', payload: { foo: 'bar' }}, (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();
      done();
    });
  });

  it('... callbacks true when event is saved - again', (done) => {
    saveEvent({ aggregateID: 'DEE', aggregate: 'billing', context: 'active', payload: { foo: 'bar' }}, (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();
      done();
    });
  });
});
