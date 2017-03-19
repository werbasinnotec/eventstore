'use strict';

const assert = require('assertthat');
const mergeEventsforSnapshot = require('../../lib/snapshots/mergeEventsforSnapshot');

describe('mergeEventsforSnapshot...', () => {
  it('... is of type function', (done) => {
    assert.that(mergeEventsforSnapshot).is.ofType('function');
    done();
  });

  it('... throws an error when oldPayload is not defined', (done) => {
    assert.that(() => mergeEventsforSnapshot()).is.throwing('Function is called without old Payload');
    done();
  });

  it('... throws an error when the eventlist is not defined', (done) => {
    assert.that(() => mergeEventsforSnapshot({})).is.throwing('Function is called without the eventslist');
    done();
  });

  it('... callbacks the correct Payload', (done) => {
    const oldPayload = { name: 'Wiesmüller', firstname: 'Martin', bankAccount: 500 };
    const events = [{ payload: { bankAccount: -10 }}, { payload: { bankAccount: -10 }}, { payload: { bankAccount: -10 }}, { payload: { bankAccount: -10 }}, { payload: { bankAccount: -10 }}, { payload: { bankAccount: -10, address: { street: 'Musterweg 4' }}}];

    assert.that(mergeEventsforSnapshot(oldPayload, events)).is.equalTo({ name: 'Wiesmüller', firstname: 'Martin', address: { street: 'Musterweg 4' }, bankAccount: 440 });
    done();
  });
});
