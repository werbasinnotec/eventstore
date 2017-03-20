'use strict';

const mdbhandler = require('mongodb-handler');
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');
const getLastSnapshotByAggregateID = require('./getLastSnapshotByAggregateID');
const mergeEventsforSnapshot = require('./mergeEventsforSnapshot');

const createSnapshotByAggregateID = (aggregateID, callback) => {
  if (!aggregateID) {
    return callback('The function is called without aggregateID');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  getLastSnapshotByAggregateID(aggregateID, (err, lastSnap) => {
    if (err) {
      return callback(err);
    }

    const collectionEvents = cache.read('eventstore_options').eventsCollectionName || 'events';
    const collectionSnap = cache.read('eventstore_options').snapShotCollectionName || 'snapshots';

    if (!lastSnap) {
      mdbhandler.fetch({ collection: collectionEvents, doc: { aggregateID }}, (err2, eventslist) => {
        if (err2) {
          return callback(err2);
        }

        const newPayload = mergeEventsforSnapshot({}, eventslist);

        const insert = {
          timestamp: moment().unix(),
          aggregateID,
          lastEventID: eventslist[eventslist.length - 1]._id,
          payload: newPayload
        };

        mdbhandler.insert({ collection: collectionSnap, doc: insert }, (err3) => {
          if (err3) {
            return callback(err3);
          }

          callback(null, true);
        });
      });
    } else {
      mdbhandler.fetch({ collection: collectionEvents, doc: { aggregateID, _id: { $gt: lastSnap.lastEventID }}}, (err2, eventslist) => {
        if (err2) {
          return callback(err2);
        }

        // Create Snapshot only when events are avaiable
        if (eventslist.length === 0) {
          return callback(null, true);
        }

        const newPayload = mergeEventsforSnapshot(lastSnap.payload, eventslist);
        let lastEventID = lastSnap.lastEventID;

        if (eventslist.length !== 0) {
          lastEventID = eventslist[eventslist.length - 1]._id;
        }

        const insert = {
          timestamp: moment().unix(),
          aggregateID,
          lastEventID,
          payload: newPayload
        };

        mdbhandler.insert({ collection: collectionSnap, doc: insert }, (err3) => {
          if (err3) {
            return callback(err3);
          }

          callback(null, true);
        });
      });
    }
  });
};

module.exports = createSnapshotByAggregateID;
