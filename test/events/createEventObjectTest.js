'use strict';

const assert = require('assertthat');
const createEventObject = require('../../lib/events/createEventObject');

describe('createEventObject...', () => {
  it('... is of type function', (done) => {
    assert.that(createEventObject).is.ofType('function');
    done();
  });

  it('... callbacks an error when obj is not defined', (done) => {
    createEventObject(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without data-object');
      done();
    });
  });

  it('... callbacks an error when no aggreagateID is defined in the object', (done) => {
    createEventObject({}, (err) => {
      assert.that(err).is.equalTo('Function is called without aggreagateID');
      done();
    });
  });

  it('... callbacks an error when no aggreagateID is defined in the object', (done) => {
    createEventObject({ aggregateID: '58cc4fb453d1ae58de792f31' }, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregate');
      done();
    });
  });

  it('... callbacks an error when no payload is defined in the object', (done) => {
    createEventObject({ aggregateID: '58cc4fb453d1ae58de792f31', aggregate: 'billing' }, (err) => {
      assert.that(err).is.equalTo('Function is called without payload');
      done();
    });
  });

  it('... callbacks an object when process is done', (done) => {
    createEventObject({ aggregateID: '58cc4fb453d1ae58de792f31', aggregate: 'billing', payload: { foo: 'bar' }}, (err, eventObj) => {
      if (err) {
        throw err;
      }

      assert.that(eventObj).is.ofType('object');
      done();
    });
  });
});
