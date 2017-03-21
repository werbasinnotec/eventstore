'use strict';

const assert = require('assertthat');
const destroyTransaction = require('../../lib/transactions/destroyTransaction');
const saveEvent = require('../../lib/events/saveEvent');

describe('destroyTransaction...', () => {
  it('... is of type function', (done) => {
    assert.that(destroyTransaction).is.ofType('function');
    done();
  });

  it('... callbacks an error when no aggregateID is defined', (done) => {
    destroyTransaction(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... callbacks true when process is done', (done) => {
    const obj = { aggregateID: '58c7ca8f58c3b54cf2b56ea4', aggregate: 'billing', context: 'active', payload: { foo: 'bar' }};

    saveEvent(obj, (err) => {
      if (err) {
        throw err;
      }

      destroyTransaction('58c7ca8f58c3b54cf2b56ea4', (err2, res) => {
        if (err2) {
          throw err2;
        }

        assert.that(res).is.true();
        done();
      });
    });
  });
});
