'use strict';

const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const cache = require('../cache/setandreadCache');
const checkifTransactionFamous = require('../transactions/checkifTransactionFamous');
const createNewTransaction = require('../transactions/createNewTransaction');
const createEventObject = require('./createEventObject');

const saveEvent = (data, callback) => {
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

  const collection = cache.read('eventstore_options').eventsCollectionName || 'events';

  checkifTransactionFamous(data.aggregateID, (err, famous) => {
    if (err) {
      return callback(err);
    }

    createEventObject(data, (err1, eventObj) => {
      if (err1) {
        return callback(err1);
      }

      if (!famous) {
        createNewTransaction(data.aggregate, data.aggregateID, data.context || 'UNKNOW', (err2) => {
          if (err2) {
            return callback(err2);
          }

          mdbhandler.insert({ collection, doc: eventObj }, (err3) => {
            if (err3) {
              return callback(err3);
            }

            callback(null, true);
          });
        });
      } else {
        mdbhandler.insert({ collection, doc: eventObj }, (err3) => {
          if (err3) {
            return callback(err3);
          }

          callback(null, true);
        });
      }
    });
  });
};

module.exports = saveEvent;
