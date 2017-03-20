'use strict';

const processenv = require('processenv');
const guid = require('guid');
const merge = require('merge');
const moment = require('moment');
const snooper = require('snooper');

const cache = require('./cache/setandreadCache');
const createGlobalSnapshot = require('./snapshots/createGlobalSnapshot');
const createSnapshotByAggregateID = require('./snapshots/createSnapshotByAggregateID');
const getActualAggregateIDInformation = require('./snapshots/getActualAggregateIDInformation');
const saveEvent = require('./events/saveEvent');

const defaultOptions = require('./defaultOptions');

const Connection = module.exports = function Connection (options) {
  // start System
  Connection.prototype.start = (options) => {

    options = merge(defaultOptions, options);

    cache.set('eventstore_options', options);
  }

  Connection.prototype.saveEvent = (data, callback) => {
    saveEvent(data, (err) => {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    });
  }

  Connection.prototype.createGlobalSnapshot = (callback) => {
    createGlobalSnapshot((err) => {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    });
  }

  Connection.prototype.createAggregateSnapshot = (aggregateID, callback) => {
    createSnapshotByAggregateID(aggregateID, (err) => {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    });
  }

  Connection.prototype.getActualAggregateIDInformation = (aggregateID, callback) => {
    getActualAggregateIDInformation(aggregateID, (err, res) => {
      callback(err, res);
    });
  }

  // getAggregateInformationbyRange
  Connection.prototype.getAggregateIDInformationbyRange = (aggregateID, range) => {

  }

  // getCompleteAggregateInformation
  Connection.prototype.getCompleteAggregateInformation = (aggregate) => {

  }
};
