'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;
const cache = require('../cache/setandreadCache');
const getEventsbyRange = require('../events/getEventsbyRange');
const getLastSnapshotByAggregateID = require('./getLastSnapshotByAggregateID');
const mergeEventsforSnapshot = require('./mergeEventsforSnapshot');

const getAggregateIDInformationbyRange = (aggregateID, min, max, callback) => {
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

  const collectionEvents = cache.read('eventstore_options').eventsCollectionName || 'events';

  getEventsbyRange(aggregateID, min, max, (err, eventslist) => {
    if (err) {
      return callback(err);
    }

    getLastSnapshotByAggregateID(aggregateID, (err2, lastsnapshot) => {
      if (err2) {
        return callback(err2);
      }

      let payload = {};

      if (lastsnapshot) {
        payload = lastsnapshot.payload;
      }

      if (eventslist[0].revision !== 0) {
        mdbhandler.fetchlastNdocuments({ collection: collectionEvents, doc: { aggregateID, _id: { $lt: eventslist[0]._id }}, last: eventslist[0].revision }, (err3, missingEvents) => {
          if (err3) {
            return callback(err3);
          }

          const completeList = missingEvents.reverse();

          for (let i = 0; i < eventslist.length; i++) {
            completeList.push(eventslist[i]);
          }

          const obj = { lastsnapshot: lastsnapshot || {}, eventslist, payload: mergeEventsforSnapshot(payload, completeList) };

          callback(null, obj);
        });
      } else {
        const obj = { lastsnapshot: lastsnapshot || {}, eventslist, payload: mergeEventsforSnapshot(payload, eventslist) };

        callback(null, obj);
      }
    });
  });
};

module.exports = getAggregateIDInformationbyRange;
