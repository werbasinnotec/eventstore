'use strict';

const ObjectID = require('mongodb').ObjectID;

const getlastEventbyAggregateId = require('./getlastEventbyAggregateId');
const getLastSnapshotByAggregateID = require('../snapshots/getLastSnapshotByAggregateID');

const getNextRevisionByAggregateId = (aggregateID, callback) => {
  if (!aggregateID) {
    return callback('Function is called without aggregateID');
  }

  if (/[a-f0-9]{24}/.test(aggregateID)) {
    aggregateID = new ObjectID(aggregateID.toString());
  }

  getlastEventbyAggregateId(aggregateID, (err, eventObj) => {
    if (err) {
      return callback(err);
    }

    getLastSnapshotByAggregateID(aggregateID, (err2, snapshot) => {
      if (err2) {
        return callback(err2);
      }

      let newRevision = 0;

      if (eventObj) {
        newRevision = eventObj.revision + 1;
      }

      if (snapshot && snapshot._id > eventObj._id) {
        return callback(null, 0);
      }

      callback(null, newRevision);
    });
  });
};

module.exports = getNextRevisionByAggregateId;
