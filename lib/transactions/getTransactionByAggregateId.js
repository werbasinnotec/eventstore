'use strict';

const database = require('../database');
const logger = require('../logger');

const getTransactionByAggregateId = async (aggregateId) => {
  return new Promise((resolve, reject) => {
    if (!aggregateId) {
      const message = 'Function is called without an aggregateId';

      logger.error(message);
      return reject(message);
    }

    (async () => {
      try {
        aggregateId = database.validateObjectID(aggregateId);
        const res = await database.transaction().find({ aggregateId }).toArray();

        if (res.length === 0) {
          return resolve(false);
        }

        resolve(res[0]);
      } catch (err) {
        reject(err);
      }
    })();
  });
};

module.exports = getTransactionByAggregateId;
