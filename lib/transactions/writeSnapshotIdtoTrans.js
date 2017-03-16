'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');
const checkifTransactionFamous = require('./checkifTransactionFamous');

const writeSnapshotidtoTrans = (aggregateID, snapshotId, callback) => {
  if (!aggregateID) {
    return callback('Function is called without aggregateID');
  }

  if (!snapshotId) {
    return callback('Function is called without snapshotId');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  if (/[a-f0-9]{24}/.test(snapshotId)) {
    snapshotId = new ObjectID(snapshotId.toString());
  }

  const collection = cache.read('eventstore_options').transactionsCollectionName || 'transactions';

  checkifTransactionFamous(aggregateID, (err, famous) => {
    if (err) {
      return callback(err);
    }

    if (!famous) {
      return callback('The named aggregateID is not famous in system');
    }

    mdbhandler.fetch({ collection, doc: { aggregateID }}, (err2, transaction) => {
      if (err2) {
        return callback(err2);
      }

      transaction[0].snapshotid = snapshotId;

      mdbhandler.update({ collection, update: { aggregateID }, doc: transaction[0] }, (err3) => {
        if (err3) {
          return callback(err3);
        }

        callback(null, true);
      });
    });
  });
};

module.exports = writeSnapshotidtoTrans;
