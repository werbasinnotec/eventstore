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
const getAggregateIDInformationbyRange = require('./snapshots/getAggregateIDInformationbyRange');
const saveEvent = require('./events/saveEvent');

const defaultOptions = require('./defaultOptions');

const Connection = module.exports = function Connection (options) {
  // start System
  Connection.prototype.start = (options) => {

    options = merge(defaultOptions, options);

    cache.set('eventstore_options', options);
  }

  Connection.prototype.saveEvent = (data, callback) => {
    saveEvent(data, (err, res) => {
      callback(err, res);
    });
  }

  Connection.prototype.createGlobalSnapshot = (callback) => {
    createGlobalSnapshot((err, res) => {
      callback(err, res);
    });
  }

  Connection.prototype.createAggregateSnapshot = (aggregateID, callback) => {
    createSnapshotByAggregateID(aggregateID, (err, res) => {
      callback(err, res);
    });
  }

  Connection.prototype.getActualAggregateIDInformation = (aggregateID, callback) => {
    getActualAggregateIDInformation(aggregateID, (err, res) => {
      callback(err, res);
    });
  }

  // getAggregateInformationbyRange
  Connection.prototype.getAggregateIDInformationbyRange = (aggregateID, range) => {
    getAggregateIDInformationbyRange(aggregateID, (err, res) => {
      callback(err, res);
    });
  }

  // getCompleteAggregateInformation
  Connection.prototype.getCompleteAggregateInformation = (aggregate) => {

  }
};
