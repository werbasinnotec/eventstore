'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');
const getLastSnapshotByAggregateID = require('../snapshots/getLastSnapshotByAggregateID');

const getAllActualEvents = (aggregateID, callback) => {
  if (!aggregateID) {
    return callback('Function is called without aggregateID');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  const collection = cache.read('eventstore_options').eventsCollectionName || 'events';

  getLastSnapshotByAggregateID(aggregateID, (err, lastSnap) => {
    if (err) {
      return callback(err);
    }

    let req = { aggregateID };

    if (lastSnap) {
      req = { aggregateID, _id: { $gt: lastSnap.lastEventID }};
    }

    mdbhandler.fetch({ collection, doc: req }, (err2, eventslist) => {
      if (err2) {
        return callback(err2);
      }

      callback(null, eventslist);
    });
  });
};

module.exports = getAllActualEvents;
