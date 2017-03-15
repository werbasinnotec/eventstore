'use strict';

const EventEmitter = require('events').EventEmitter;
const processenv = require('processenv');
const guid = require('guid');
const moment = require('moment');
const _ = require('lodash');
const snooper = require('snooper');
const util = require('util');

const Connection = module.exports = function Connection (options) {
  EventEmitter.call(this);

  // start System
  Connection.prototype.start = (options) => {

  }

  // saveEvent
  Connection.prototype.saveEvent = (data) => {

  }

  // createGlobalSnapshot
  Connection.prototype.createGlobalSnapshot = () => {

  }

  // createAggregateSnapshot
  Connection.prototype.createAggregateSnapshot = (aggregateID) => {

  }

  // getAggregateInformationbyRange
  Connection.prototype.getAggregateInformationbyRange = (aggregateID, range) => {

  }

  // getLastAggregateInformation
  Connection.prototype.getLastAggregateInformation = (aggregateID) => {

  }

  // getCompleteAggregateInformation
  Connection.prototype.getCompleteAggregateInformation = (aggregate) => {

  }
};

util.inherits(Connection, EventEmitter);
