'use strict';

const database = require('../database');
const getTransactionByAggregateId = require('./getTransactionByAggregateId');
const merge = require('merge');
const logger = require('../logger');

const destroy = async (aggregateId) => {
  return new Promise((resolve, reject) => {
    if (!aggregateId) {
      const message = 'Function is called without a aggregateId';

      logger.error(message);
      return reject(message);
    }

    (async () => {
      try {
        const transAction = await getTransactionByAggregateId(aggregateId);

        if (!transAction) {
          const message = 'The called aggregateId is unknow!';

          logger.error(message);
          return reject(message);
        }

        await database.transaction().updateOne({ _id: transAction._id }, { $set: merge(transAction, { deleted: true }) });

        resolve(true);
      } catch (err) {
        reject(err);
      }
    })();
  });
};

module.exports = destroy;
