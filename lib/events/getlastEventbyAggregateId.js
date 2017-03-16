'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');

const getlastEventbyAggregateId = (aggregateID, callback) => {
  if (!aggregateID) {
    return callback('Function is called without aggregateID');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  const collection = cache.read('eventstore_options').eventsCollectionName || 'events';

  mdbhandler.fetchlastNdocuments({ collection, doc: { aggregateID }, last: 1 }, (err, result) => {
    if (err) {
      return callback(err);
    }

    callback(null, result[0]);
  });
};

module.exports = getlastEventbyAggregateId;
