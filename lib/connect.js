'use strict';

const logger = require('./logger');
const database = require('./database');

const merge = require('merge');
const schedule = require('node-schedule');

const cache = require('./cache');
const events = require('./events');
const replay = require('./replay');
const snapshots = require('./snapshots');
const transactions = require('./transactions');

const defaultOptions = require('./defaultOptions');

module.exports = function Connection () {
  Connection.prototype.start = (options) => {
    options = merge(defaultOptions, options);
    cache.set('eventstore_options', options);
    logger.info('System is running with follow options', options);

    (async () => {
      await database.connect();
    })();

    schedule.scheduleJob(options.globalSnapshotScheduler, () => {
      (async () => {
        try {
          await snapshots.create();
        } catch (err) {
          logger.fatal(err);
        }
      })();
    });
  };

  Connection.prototype.saveEvent = (data) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const res = await events.saveEvent(data);

          logger.info('Event with revision ' + res.revision + ' has been saved');
          resolve(res);
        } catch (err) {
          logger.fatal(err);
          reject(err);
        }
      })();
    })();
  };

  Connection.prototype.createGlobalSnapshot = () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const res = await snapshots.create();

          logger.info('Global Snapshot is done');
          resolve(res);
        } catch (err) {
          logger.fatal(err);
          reject(err);
        }
      })();
    });
  };

  Connection.prototype.createAggregateIdSnapshot = (aggregateId) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const res = await snapshots.create(aggregateId);

          logger.info('Snapshot on aggregateId ' + aggregateId + ' is done');
          resolve(res);
        } catch (err) {
          logger.fatal(err);
          reject(err);
        }
      })();
    })();
  };

  Connection.prototype.getEventsfromAggregateId = (aggregateId, min, max) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const res = await events.getEventsByRange(aggregateId, min, max);

          logger.info('Events for aggregateId fetched, count: ' + res.length);
          resolve(res);
        } catch (err) {
          logger.fatal(err);
          reject(err);
        }
      })();
    });
  };

  Connection.prototype.destroyAggregateId = (aggregateId) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const res = await transactions.destroy(aggregateId);

          logger.info('Transaction for AggregateId ' + aggregateId + ' is destroyed successfully');
          resolve(res);
        } catch (err) {
          logger.fatal(err);
          reject(err);
        }
      })();
    });
  };

  Connection.prototype.replayData = (aggregate) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const res = await replay.create(aggregate);

          resolve(res);
        } catch (err) {
          logger.fatal(err);
          reject(err);
        }
      })();
    });
  };
};
