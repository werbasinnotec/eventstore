'use strict';

const assert = require('assertthat');

const createNewTransaction = require('../../lib/transactions/createNewTransaction');
const writeSnapshotidtoTrans = require('../../lib/transactions/writeSnapshotIdtoTrans');

describe('writeSnapshotidtoTrans...', () => {
  it('... is of type function', (done) => {
    assert.that(writeSnapshotidtoTrans).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    writeSnapshotidtoTrans(undefined, undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... callbacks an error when snapshotId is not defined', (done) => {
    writeSnapshotidtoTrans('KJsfsdkjnfJKFNksdf', undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without snapshotId');
      done();
    });
  });

  it('... callbacks an error when aggregateID is not famous in system', (done) => {
    writeSnapshotidtoTrans('KJsfsdkjnfJKFNksdf', 'DEF', (err) => {
      assert.that(err).is.equalTo('The named aggregateID is not famous in system');
      done();
    });
  });

  it('... calbacks true when process is done', (done) => {
    createNewTransaction('KJsfsdkjnfJKFNksdf', 'person', (err) => {
      if (err) {
        throw err;
      }

      writeSnapshotidtoTrans('KJsfsdkjnfJKFNksdf', 'DEF', (err1) => {
        if (err1) {
          throw err1;
        }

        done();
      });
    });
  });
});
