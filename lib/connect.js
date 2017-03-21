'use strict';

const logger = require('flaschenpost').getLogger();
const merge = require('merge');
const schedule = require('node-schedule');

const cache = require('./cache/setandreadCache');
const createGlobalSnapshot = require('./snapshots/createGlobalSnapshot');
const createSnapshotByAggregateID = require('./snapshots/createSnapshotByAggregateID');
const destroyTransaction = require('./transactions/destroyTransaction');
const getActualAggregateIDInformation = require('./snapshots/getActualAggregateIDInformation');
const getAggregateIDInformationbyRange = require('./snapshots/getAggregateIDInformationbyRange');
const getCompleteAggregateInformation = require('./aggregate/getcompleteAggregateInformation');
const saveEvent = require('./events/saveEvent');

const defaultOptions = require('./defaultOptions');

/* eslint-disable */
const Connection = module.exports = function Connection (options) {
  Connection.prototype.start = (options) => {
    options = merge(defaultOptions, options);
    cache.set('eventstore_options', options);
    logger.info('[ES] - System is running with follow options', options);
    schedule.scheduleJob(options.globalSnapshotScheduler, () => {
      createGlobalSnapshot((err) => {
        if (err) {
          throw err;
        }
      });
    });
  }
/* eslint-enable */
  Connection.prototype.saveEvent = (data, callback) => {
    saveEvent(data, (err, res) => {
      if (err) {
        logger.error('[ES] - Error on saveEvent: ', err);

        return callback(err);
      }

      logger.debug('[ES] - System has saved follow event: ', data);
      callback(null, res);
    });
  };

  Connection.prototype.createGlobalSnapshot = (callback) => {
    createGlobalSnapshot((err, res) => {
      if (err) {
        logger.error('[ES] - Error on createGlobalSnapshot: ', err);

        return callback(err);
      }

      logger.debug('[ES] - The system has created a global Snapshot');
      callback(null, res);
    });
  };

  Connection.prototype.createAggregateSnapshot = (aggregateID, callback) => {
    createSnapshotByAggregateID(aggregateID, (err, res) => {
      if (err) {
        logger.error('[ES] - Error on createAggregateSnapshot: ', err);

        return callback(err);
      }

      logger.debug('[ES] - The system has created a Snapshot on ID: ', aggregateID);
      callback(null, res);
    });
  };

  Connection.prototype.getActualAggregateIDInformation = (aggregateID, callback) => {
    getActualAggregateIDInformation(aggregateID, (err, res) => {
      if (err) {
        logger.error('[ES] - Error on getActualAggregateIDInformation: ', err);

        return callback(err);
      }

      logger.debug('[ES] - The system response the information by follow aggregateID: ', aggregateID);
      callback(null, res);
    });
  };

  Connection.prototype.getAggregateIDInformationbyRange = (aggregateID, range, callback) => {
    getAggregateIDInformationbyRange(aggregateID, range, (err, res) => {
      if (err) {
        logger.error('[ES] - Error on getAggregateIDInformationbyRange: ', err);

        return callback(err);
      }

      logger.debug('[ES] - The system response the range-information by follow aggregateID: ', aggregateID);
      callback(null, res);
    });
  };

  Connection.prototype.getCompleteAggregateInformation = (aggregate, callback) => {
    getCompleteAggregateInformation(aggregate, (err, res) => {
      if (err) {
        logger.error('[ES] - Error on getCompleteAggregateInformation: ', err);

        return callback(err);
      }

      logger.debug('[ES] - The system response the complete aggregate information: ', aggregate);
      callback(null, res);
    });
  };

  Connection.prototype.destroyAggregateID = (aggregateID, callback) => {
    destroyTransaction(aggregateID, (err, res) => {
      if (err) {
        logger.error('[ES] - Error on destroyAggregateID: ', err);

        return callback(err);
      }

      logger.debug('[ES] - The system has destroyed follow aggregateID: ', aggregateID);
      callback(null, res);
    });
  };
};
