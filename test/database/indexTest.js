'use strict';

const assert = require('assertthat');
const path = require('path');
const database = require(path.resolve('./lib/database'));

describe('database...', () => {
  it('... is of type object', (done) => {
    assert.that(database).is.ofType('object');
    done();
  });

  it('... database.connect is of type function', (done) => {
    assert.that(database.connect).is.ofType('function');
    done();
  });

  it('... database.connect resolves the database connection', (done) => {
    (async () => {
      try {
        const res = await database.connect();

        assert.that(res).is.not.undefined();
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  it('... database.client must exist', (done) => {
    assert.that(database.client).is.ofType('function');
    done();
  });

  it('... database.client must return the client', (done) => {
    (async () => {
      try {
        await database.connect();

        assert.that(database.client).is.not.undefined();
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  // it('... database.validateObjectID must exist', (done) => {
  //   assert.that(database.validateObjectID).is.ofType('function');
  //   done();
  // });

  // it('... database.transaction must exist', (done) => {
  //   assert.that(database.transaction).is.ofType('function');
  //   done();
  // });

  // it('... database.transaction must return the methods', (done) => {
  //   assert.that(database.transaction()).is.not.undefined();
  //   done();
  // });

  // it('... database.event must exist', (done) => {
  //   assert.that(database.event).is.ofType('function');
  //   done();
  // });

  // it('... database.event must return the methods', (done) => {
  //   assert.that(database.event()).is.not.undefined();
  //   done();
  // });

  // it('... database.snapshot must exist', (done) => {
  //   assert.that(database.snapshot).is.ofType('function');
  //   done();
  // });

  // it('... database.snapshot must return the methods', (done) => {
  //   assert.that(database.snapshot()).is.not.undefined();
  //   done();
  // });
});
