'use strict';

const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;

const getNextRevisionByAggregateId = require('./getNextRevisionByAggregateId');

const createEventObject = (data, callback) => {
  if (!data) {
    return callback('Function is called without data-object');
  }

  if (!data.aggregateID) {
    return callback('Function is called without aggreagateID');
  }

  if (!data.aggregate) {
    return callback('Function is called without aggregate');
  }

  if (!data.payload) {
    return callback('Function is called without payload');
  }

  if (/[a-f0-9]{24}/.test(data.aggregateID)) {
    data.aggregateID = new ObjectID(data.aggregateID.toString());
  }

  getNextRevisionByAggregateId(data.aggregateID, (err, revision) => {
    if (err) {
      return callback(err);
    }

    const eventObj = {
      aggregateID: data.aggregateID,
      aggregate: data.aggregate,
      payload: data.payload,
      context: data.context || 'UNKNOW',
      revision,
      timestamp: moment().toISOString()
    };

    callback(null, eventObj);
  });
};

module.exports = createEventObject;
