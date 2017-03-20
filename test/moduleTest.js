'use strict';

const assert = require('assertthat');
const dropDatabase = require('./dropDatabase');
const eventstore = require('../lib');

let es;

describe('Testing Eventstoremodule....', () => {
  before(() => {
    dropDatabase((err) => {
      if (err) {
        throw err;
      }
    });

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

    it('... must callback an error when obj is not defined', (done) => {
      es.saveEvent(undefined, (err) => {
        assert.that(err).is.equalTo('Function is called without data-object');
        done();
      });
    });

    it('... must callback an error when aggregateID is not defined in the obejct', (done) => {
      es.saveEvent({}, (err) => {
        assert.that(err).is.equalTo('Function is called without aggreagateID');
        done();
      });
    });

    it('... must callback an error when aggregate is not defined', (done) => {
      es.saveEvent({ aggregateID: 'ABC' }, (err) => {
        assert.that(err).is.equalTo('Function is called without aggregate');
        done();
      });
    });

    it('... must callback an error when payload is not defined', (done) => {
      es.saveEvent({ aggregateID: 'ABC', aggregate: 'billing' }, (err) => {
        assert.that(err).is.equalTo('Function is called without payload');
        done();
      });
    });

    it('... must callback true when event is saved', (done) => {
      es.saveEvent({ aggregateID: '58cb9f74dc17723d7b92a44b', aggregate: 'billing', context: 'person', payload: { name: 'Martin', lastname: 'Wiesmüller' }}, (err, res) => {
        if (err) {
          throw err;
        }

        assert.that(res).is.true();

        es.saveEvent({ aggregateID: '58cb9f74dc17723d7b92a44b', aggregate: 'billing', context: 'person', payload: { name: 'Martin', lastname: 'Wiesmüller', married: true }}, (err1, res1) => {
          if (err1) {
            throw err1;
          }

          assert.that(res1).is.true();

          es.saveEvent({ aggregateID: '58cb9f74dc17723d7b92a44b', aggregate: 'billing', context: 'person', payload: { name: 'Martin', lastname: 'Wiesmüller', married: true, deleted: true }}, (err2, res2) => {
            if (err2) {
              throw err2;
            }

            assert.that(res2).is.true();

            es.saveEvent({ aggregateID: '58cb9f74dc17723d7b92a44b', aggregate: 'billing', context: 'person', payload: { name: 'Martin', lastname: 'Wiesmüller', married: true, deleted: false }}, (err3, res3) => {
              if (err3) {
                throw err3;
              }

              assert.that(res3).is.true();
              done();
            });
          });
        });
      });
    });
  });

  describe('.... subfunction createGlobalSnapshot ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.createGlobalSnapshot).is.ofType('function');
      done();
    });

    it('... create Testdata', (done) => {
      let i = 0;
      let count;

      const create = () => {
        if (i === 0) {
          count = 6000;
        } else {
          count = -1;
        }

        es.saveEvent({ aggregateID: '58cd00d657d9ff5ac701f263', aggregate: 'billing', context: 'person', payload: { name: 'Martin', lastname: 'Wiesmüller', married: true, count }}, (err1) => {
          if (err1) {
            throw err1;
          }

          i++;

          if (i < 5000) {
            setTimeout(create, 0);
          } else {
            done();
          }
        });
      };

      create();
    });

    it('... callbacks true when process is done', (done) => {
      es.createGlobalSnapshot((err, res) => {
        if (err) {
          throw err;
        }

        assert.that(res).is.true();
        done();
      });
    });
  });

  describe('.... subfunction createAggregateSnapshot ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.createAggregateSnapshot).is.ofType('function');
      done();
    });

    it('... create Testdata', (done) => {
      let i = 0;
      let count;

      const create = () => {
        if (i === 0) {
          count = 6000;
        } else {
          count = -1;
        }

        es.saveEvent({ aggregateID: '58cbb053719ba3408e5d4767', aggregate: 'billing', context: 'person', payload: { name: 'Martin', lastname: 'Wiesmüller', married: true, count }}, (err1) => {
          if (err1) {
            throw err1;
          }

          i++;

          if (i < 5000) {
            setTimeout(create, 0);
          } else {
            done();
          }
        });
      };

      create();
    });

    it('... must callback true when process is done', (done) => {
      es.createAggregateSnapshot('58cbb053719ba3408e5d4767', (err, res) => {
        if (err) {
          throw err;
        }

        assert.that(res).is.true();
        done();
      });
    });
  });

  describe('.... subfunction getActualAggregateIDInformation ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.getActualAggregateIDInformation).is.ofType('function');
      done();
    });

    it('... callbacks the correct object when no snapshot is avaiabled', (done) => {
      const obj = {
        aggregateID: '58775355af95ea15098fad63',
        aggregate: 'billing',
        context: 'packages',
        payload: {
          name: 'Testpackage'
        }
      };

      es.saveEvent(obj, (err1) => {
        if (err1) {
          throw err1;
        }

        obj.payload.price = 14.99;

        es.saveEvent(obj, (err2) => {
          if (err2) {
            throw err2;
          }

          es.getActualAggregateIDInformation('58775355af95ea15098fad63', (err3, info) => {
            if (err3) {
              throw err3;
            }

            assert.that(info).is.equalTo({ name: 'Testpackage', price: 14.99 });
            done();
          });
        });
      });
    });

    it('... callbacks the correct object when a snapshot is avaiabled', (done) => {
      es.createAggregateSnapshot('58775355af95ea15098fad63', (err, res) => {
        if (err) {
          throw err;
        }

        assert.that(res).is.true();

        const obj = {
          aggregateID: '58775355af95ea15098fad63',
          aggregate: 'billing',
          context: 'packages',
          payload: {
            description: 'I am a testdescription'
          }
        };

        es.saveEvent(obj, (err1, res1) => {
          if (err1) {
            throw err1;
          }

          assert.that(res1).is.true();

          es.getActualAggregateIDInformation('58775355af95ea15098fad63', (err2, info) => {
            if (err2) {
              throw err2;
            }

            assert.that(info).is.equalTo({ name: 'Testpackage', price: 14.99, description: 'I am a testdescription' });
            done();
          });
        });
      });
    });
  });

  describe('.... subfunction getAggregateInformationbyRange ....', () => {
    it('... is of type function', (done) => {
      assert.that(es.getAggregateInformationbyRange).is.ofType('function');
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
