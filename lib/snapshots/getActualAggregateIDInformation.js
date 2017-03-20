'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');
const getLastSnapshotByAggregateID = require('./getLastSnapshotByAggregateID');
const mergeEventsforSnapshot = require('./mergeEventsforSnapshot');

const getActualAggregateIDInformation = (aggregateID, callback) => {
  if (!aggregateID) {
    return callback('Function is called without aggregateID');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  const collectionEvents = cache.read('eventstore_options').eventsCollectionName || 'events';

  getLastSnapshotByAggregateID(aggregateID, (err, lastSnap) => {
    if (err) {
      return callback(err);
    }

    if (!lastSnap) {
      mdbhandler.fetch({ collection: collectionEvents, doc: { aggregateID }}, (err2, eventslist) => {
        if (err2) {
          return callback(err2);
        }

        callback(null, mergeEventsforSnapshot({}, eventslist));
      });
    } else {
      mdbhandler.fetch({ collection: collectionEvents, doc: { aggregateID, _id: { $gt: lastSnap.lastEventID }}}, (err2, eventslist) => {
        if (err2) {
          return callback(err2);
        }

        callback(null, mergeEventsforSnapshot(lastSnap.payload, eventslist));
      });
    }
  });
};

module.exports = getActualAggregateIDInformation;
