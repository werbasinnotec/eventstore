'use strict';

const mdbhandler = require('mongodb-handler');

const cache = require('../cache/setandreadCache');

const checkifTransactionFamous = (aggregateID, callback) => {
  if (!aggregateID) {
    return callback('aggregateID is not defined');
  }

  const collection = cache.read('eventstore_options').transactionsCollectionName || 'transactions';

  mdbhandler.fetch({ collection, doc: { aggregateID }}, (err, result) => {
    if (err) {
      return callback(err);
    }

    if (result.length === 0) {
      return callback(null, false);
    }

    callback(null, true);
  });
};

module.exports = checkifTransactionFamous;
