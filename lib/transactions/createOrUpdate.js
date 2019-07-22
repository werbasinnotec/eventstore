'use strict';

const database = require('../database');
const logger = require('../logger');
const merge = require('merge');
const getTransactionByAggregateId = require('./getTransactionByAggregateId');

const createOrUpdate = async (transaction) => {
  return new Promise((resolve, reject) => {
    if (!transaction || !transaction.aggregateId || !transaction.aggregate) {
      const message = 'Function is called without or incomplete transaction object';

      logger.error(message);
      return reject(message);
    }

    (async () => {
      try {
        const trans = await getTransactionByAggregateId(transaction.aggregateId);

        const transObject = {
          aggregateId: database.validateObjectID(transaction.aggregateId),
          aggregate: transaction.aggregate,
          context: transaction.context,
          lastSnapshotId: transaction.lastSnapshotId || trans.lastSnapshotId
        };

        if (!trans) {
          await database.transaction().insertOne(transObject);

          return resolve(true);
        }

        await database.transaction().updateOne({ _id: trans._id }, { $set: merge(trans, transObject) });

        resolve(true);
      } catch (err) {
        reject(err);
      }
    })();
  });
};

module.exports = createOrUpdate;
