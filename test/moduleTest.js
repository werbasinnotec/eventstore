'use strict';

const assert = require('assertthat');
const eventstore = require('../lib');

let es;

describe('Testing Eventstoremodule....', () => {
  before(() => {
    es = eventstore.start();
  });

  describe('.... subfunction start ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.start).is.ofType('function');
      done();
    });
  });

  describe('.... subfunction saveEvent ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.saveEvent).is.ofType('function');
      done();
    });
  });

  describe('.... subfunction createGlobalSnapshot ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.createGlobalSnapshot).is.ofType('function');
      done();
    });
  });

  describe('.... subfunction createAggregateSnapshot ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.createAggregateSnapshot).is.ofType('function');
      done();
    });
  });

  describe('.... subfunction getAggregateInformationbyRange ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.getAggregateInformationbyRange).is.ofType('function');
      done();
    });
  });

  describe('.... subfunction getLastAggregateInformation ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.getLastAggregateInformation).is.ofType('function');
      done();
    });
  });

  describe('.... subfunction getCompleteAggregateInformation ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.getCompleteAggregateInformation).is.ofType('function');
      done();
    });
  });
});
