'use strict';

const assert = require('assertthat');
const createGlobalSnapshot = require('../../lib/snapshots/createGlobalSnapshot');
const ObjectID = require('mongodb').ObjectID;
const mdbhandler = require('mongodb-handler');
const moment = require('moment');

describe('createGlobalSnapshot...', () => {
  it('... is of type function', (done) => {
    assert.that(createGlobalSnapshot).is.ofType('function');
    done();
  });

  it('... create TestData', (done) => {
    const obj = [];
    let deleted;
    let testcount;

    for (let i = 0; i < 1500; i++) {
      if (i === 1) {
        testcount = 2000;
      } else {
        testcount = -1;
      }

      if (i === 100) {
        deleted = true;
      }

      if (i === 105) {
        deleted = false;
      }

      obj.push({ aggregateID: new ObjectID('58cc4bbde3e59558413daa8e'), aggregate: 'userrights', context: 'user', timestamp: moment().unix(), revision: i, payload: { foo: 'user', deleted, testcount }});
    }

    mdbhandler.bulk({ collection: 'events', doc: obj }, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... callbacks true when process is done', (done) => {
    createGlobalSnapshot((err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();
      done();
    });
  });
});
