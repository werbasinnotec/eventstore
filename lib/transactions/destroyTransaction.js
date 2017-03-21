'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');

const destroyTransaction = (aggregateID, callback) => {
  if (!aggregateID) {
    return callback('Function is called without aggregateID');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  const collection = cache.read('eventstore_options').transactionsCollectionName || 'transactions';

  mdbhandler.delete({ collection, doc: { aggregateID }}, (err) => {
    if (err) {
      return callback(err);
    }

    callback(null, true);
  });
};

module.exports = destroyTransaction;
