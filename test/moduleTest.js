'use strict';

const assert = require('assertthat');
const eventstore = require('../lib');

let es;

describe('Testing Eventstoremodule....', () => {
  before(() => {
    es = eventstore.start();
  });

  describe('.... subfunction saveEvent ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.saveEvent).is.ofType('function');
      done();
    });
  });
});
