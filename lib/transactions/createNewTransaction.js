'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');
const checkifTransactionFamous = require('./checkifTransactionFamous');

const createNewTransaction = (aggregateID, context, callback) => {
  if (!aggregateID) {
    return callback('Function is called without aggregateID');
  }

  if (!context) {
    return callback('Function is called without context');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  checkifTransactionFamous(aggregateID, (err, famous) => {
    if (err) {
      return callback(err);
    }

    if (famous) {
      return callback('The named aggregateID is already famous in the system');
    }

    const collection = cache.read('eventstore_options').transactionsCollectionName || 'transactions';

    mdbhandler.insert({ collection, doc: { aggregateID, context }}, (err2) => {
      if (err2) {
        return callback(err2);
      }

      callback(null, true);
    });
  });
};

module.exports = createNewTransaction;
