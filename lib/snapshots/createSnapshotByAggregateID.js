'use strict';

const mdbhandler = require('mongodb-handler');
const _ = require('lodash');
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');
const getLastSnapshotByAggregateID = require('./getLastSnapshotByAggregateID');

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

    const calculator = (objValue, srcValue) => {
      if (_.isNumber(objValue)) {
        return _.sum([ objValue, srcValue ]);
      }
    };

    if (!lastSnap) {
      // get all documents by aggregateID and json-diff it

      mdbhandler.fetch({ collection: collectionEvents, doc: { aggregateID }}, (err2, eventslist) => {
        if (err2) {
          return callback(err2);
        }

        let newPayload = eventslist[0].payload;

        for (let i = 1; i < eventslist.length; i++) {
          newPayload = _.mergeWith(newPayload, eventslist[i].payload, calculator);
        }

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

        let newPayload = lastSnap.payload;

        for (let i = 0; i < eventslist.length; i++) {
          newPayload = _.mergeWith(newPayload, eventslist[i].payload, calculator);
        }

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
    }
  });
};

module.exports = createSnapshotByAggregateID;
