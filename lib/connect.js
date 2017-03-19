'use strict';

const processenv = require('processenv');
const guid = require('guid');
const merge = require('merge');
const moment = require('moment');
const snooper = require('snooper');

const cache = require('./cache/setandreadCache');
const createGlobalSnapshot = require('./snapshots/createGlobalSnapshot');
const createSnapshotByAggregateID = require('./snapshots/createSnapshotByAggregateID');
const saveEvent = require('./events/saveEvent');

const defaultOptions = require('./defaultOptions');

const Connection = module.exports = function Connection (options) {
  // start System
  Connection.prototype.start = (options) => {

    options = merge(defaultOptions, options);

    cache.set('eventstore_options', options);
  }

  // saveEvent
  Connection.prototype.saveEvent = (data, callback) => {
    saveEvent(data, (err) => {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    });
  }

  // createGlobalSnapshot
  Connection.prototype.createGlobalSnapshot = (callback) => {
    createGlobalSnapshot((err) => {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    });
  }

  // createAggregateSnapshot
  Connection.prototype.createAggregateSnapshot = (aggregateID, callback) => {
    createSnapshotByAggregateID(aggregateID, (err) => {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    });
  }

  // getActualAggregateInformation
  Connection.prototype.getActualAggregateInformation = (aggregateID, callback) => {

  }

  // getAggregateInformationbyRange
  Connection.prototype.getAggregateInformationbyRange = (aggregateID, range) => {

  }

  // getCompleteAggregateInformation
  Connection.prototype.getCompleteAggregateInformation = (aggregate) => {

  }
};
