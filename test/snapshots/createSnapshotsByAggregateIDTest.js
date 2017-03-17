'use strict';

const assert = require('assertthat');
const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

const createSnapshotByAggregateID = require('../../lib/snapshots/createSnapshotByAggregateID');

describe('createSnapshotByAggregateID...', () => {
  it('... is of type function', (done) => {
    assert.that(createSnapshotByAggregateID).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    createSnapshotByAggregateID(undefined, (err) => {
      assert.that(err).is.equalTo('The function is called without aggregateID');
      done();
    });
  });

  it('... create TestData', (done) => {
    const obj = [];
    let deleted;
    let testkey;
    let supertestkey;
    let testcount;

    for (let i = 0; i < 1500; i++) {
      if (i === 1) {
        testcount = 2000;
      } else {
        testcount = -1;
      }

      if (i === 100) {
        deleted = true;
        testkey = 'Hello';
        supertestkey = 'I am defined';
      }

      if (i === 105) {
        deleted = false;
        testkey = 'Hello World';
        supertestkey = undefined;
      }

      obj.push({ aggregateID: new ObjectID('58cba19877aadb3dd9b1dd53'), aggregate: 'directory', context: 'system', timestamp: moment().unix(), revision: i, payload: { foo: 'bar', bull: { shit: true, food: 'burger' }, deleted, testcount, testkey, supertestkey }});
    }

    mdbhandler.bulk({ collection: 'events', doc: obj }, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... callbacks true when process is done (no snapshot is saved for this transaction)', (done) => {
    createSnapshotByAggregateID('58cba19877aadb3dd9b1dd53', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();
      done();
    });
  });

  it('... create TestData.. Again...', (done) => {
    const obj = [];
    let deleted;
    let testkey;
    let supertestkey;

    for (let i = 0; i <= 499; i++) {
      if (i === 2) {
        deleted = false;
        testkey = 'Hello';
        supertestkey = 'I am defined';
      }

      if (i === 3) {
        deleted = true;
        testkey = 'Hello World at your horizon';
      }

      obj.push({ aggregateID: new ObjectID('58cba19877aadb3dd9b1dd53'), aggregate: 'directory', context: 'system', timestamp: moment().unix(), revision: i, payload: { testcount: -1, deleted, additional: 'Puuh', testkey, supertestkey }});
    }

    mdbhandler.bulk({ collection: 'events', doc: obj }, (err) => {
      if (err) {
        throw err;
      }

      done();
    });
  });

  it('... callbacks true when process is done (with snapshot is saved for this transaction)', (done) => {
    createSnapshotByAggregateID('58cba19877aadb3dd9b1dd53', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();
      done();
    });
  });
});
