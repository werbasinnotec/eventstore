'use strict';

const assert = require('assertthat');
const getcompleteAggregateInformation = require('../../lib/aggregate/getcompleteAggregateInformation');
const saveEvent = require('../../lib/events/saveEvent');

describe('getcompleteAggregateInformation...', () => {
  it('... is of type function', (done) => {
    assert.that(getcompleteAggregateInformation).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregate is not defined', (done) => {
    getcompleteAggregateInformation(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without an aggregate');
      done();
    });
  });

  it('... callbacks an error when aggregate is not famous in the system', (done) => {
    getcompleteAggregateInformation('unknow', (err) => {
      assert.that(err).is.equalTo('The named aggregate is not famous in system');
      done();
    });
  });

  it('... create TestData', (done) => {
    let i = 0;

    const run = () => {
      let aggregateID = '58c7caca58c3b54cf2b56f5d';
      let context = 'articles';
      let payload = { article: 'Testarticle' + i };

      if (i > 10) {
        aggregateID = '58c7caca58c3b54cf2b56f5b';
        context = 'prices';
        payload = { currency: 'EUR', price: 10 };
      }

      saveEvent({ aggregateID, aggregate: 'reservation', context, payload }, (err) => {
        if (err) {
          throw err;
        }

        i++;

        if (i < 40) {
          run();
        } else {
          done();
        }
      });
    };

    run();
  });

  it('... response the complete aggregate information', (done) => {
    getcompleteAggregateInformation('reservation', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res.articles).is.not.undefined();
      assert.that(res.prices).is.not.undefined();
      done();
    });
  });
});
