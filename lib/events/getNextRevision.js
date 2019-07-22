'use strict';

const database = require('../database');
const logger = require('../logger');

const getNextRevision = async (aggregateId) => {
  return new Promise((resolve, reject) => {
    if (!aggregateId) {
      const message = 'Function is called without aggregateId';

      logger.error(message);
      return reject(message);
    }

    (async () => {
      try {
        aggregateId = database.validateObjectID(aggregateId);

        const lastEvent = await database.event().find({ aggregateId }).limit(1).sort({ $natural: -1 }).toArray();
        const lastSnap = await database.snapshot().find({ aggregateId }).limit(1).sort({ $natural: -1 }).toArray();

        if (!lastEvent[0] && !lastSnap[0]) {
          return resolve(0);
        }

        if (lastEvent[0] && !lastSnap[0]) {
          return resolve(lastEvent[0].revision + 1);
        }

        if (lastEvent[0] && lastSnap[0]._id > lastEvent[0]._id) {
          return resolve(0);
        }

        resolve(lastEvent[0].revision + 1);
      } catch (err) {
        reject(err);
      }
    })();
  });
};

module.exports = getNextRevision;
