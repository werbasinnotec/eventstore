'use strict';

const database = require('../database');
const logger = require('../logger');
const moment = require('moment');

const getEventsByRange = async (aggregateId, min, max) => {
  return new Promise((resolve, reject) => {
    if (!aggregateId) {
      const message = 'Function is called withot a aggregateId';

      logger.error(message);
      return reject(message);
    }

    if (!min || !moment(min, moment.ISO_8601).isValid()) {
      const message = 'Function is called without min value or value is not a ISO 8601 timestamp';

      logger.error(message);
      return reject(message);
    }

    if (!max || !moment(max, moment.ISO_8601).isValid()) {
      const message = 'Function is called without max value or value is not a ISO 8601 timestamp';

      logger.error(message);
      return reject(message);
    }

    if (moment(min).isAfter(moment(max))) {
      const message = 'Function is called with a greater max value as min value. We are not in movie "Back to future" :-)';

      logger.error(message);
      return reject(message);
    }

    aggregateId = database.validateObjectID(aggregateId);

    (async () => {
      try {
        const res = database.event().find({ aggregateId, timestamp: { $lte: max, $gte: min }}).toArray();

        resolve(res);
      } catch (err) {
        reject(err);
      }
    })();
  });
};

module.exports = getEventsByRange;
