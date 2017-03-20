'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');

const getEventsbyRange = (aggregateID, min, max, callback) => {
  if (!aggregateID) {
    return callback('Function is called without aggregateID');
  }

  if (!min || typeof min !== 'number') {
    return callback('Error in typof min parameter. Parameter is missing or in not correct format');
  }

  if (!max || typeof max !== 'number') {
    return callback('Error in typof min parameter. Parameter is missing or in not correct format');
  }

  if (min > max) {
    return callback('Error in definition of the range. The min parameter is greater as than max');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  const collection = cache.read('eventstore_options').eventsCollectionName || 'events';

  mdbhandler.fetch({ collection, doc: { aggregateID, timestamp: { $lte: max, $gte: min }}}, (err, events) => {
    if (err) {
      return callback(err);
    }

    callback(null, events);
  });
};

module.exports = getEventsbyRange;
