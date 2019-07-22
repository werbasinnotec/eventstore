'use strict';

const assert = require('assertthat');
const path = require('path');

const events = require(path.resolve(path.resolve('./lib/events')));

describe('events.getNextRevision...', () => {
  it('... is of type function', (done) => {
    assert.that(events.getNextRevision).is.ofType('function');
    done();
  });

  it('... rejects an error when no aggregateId is defined', (done) => {
    (async () => {
      try {
        await events.getNextRevision();
      } catch (err) {
        assert.that(err).is.equalTo('Function is called without aggregateId');
        done();
      }
    })();
  });

  it('... resolves Zero when no events and snapshots are present', (done) => {
    (async () => {
      try {
        const res = await events.getNextRevision('5b976018d8eeab263966de37');

        assert.that(res).is.equalTo(0);
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
