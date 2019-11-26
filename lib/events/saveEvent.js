'use strict';

const cache = require('../cache');
const database = require('../database');
const logger = require('../logger');
const getNextRevision = require('./getNextRevision');
const transaction = require('../transactions');
const snapshot = require('../snapshots');
const moment = require('moment');

const saveEvent = async (data) => {
  return new Promise((resolve, reject) => {
    if (!data || typeof data !== 'object' || !data.aggregateId || !data.aggregate || !data.payload) {
      const message = 'Function is called without complete information';

      logger.error(message);
      return reject(message);
    }

    const maxEventsbyAggregateID = cache.read('eventstore_options').maxEventsbyAggregateID || 300;

    (async () => {
      try {
        const revision = await getNextRevision(data.aggregateId);

        const eventObj = {
          aggregateId: database.validateObjectID(data.aggregateId),
          aggregate: data.aggregate,
          payload: data.payload,
          hardwrite: data.hardwrite,
          context: data.context || 'unknow',
          revision,
          timestamp: moment().toISOString()
        };

        await transaction.createOrUpdate({
          aggregateId: database.validateObjectID(data.aggregateId),
          aggregate: data.aggregate,
          payload: data.payload,
          context: data.context || 'unknow'
        });

        await database.event().insertOne(eventObj);

        if (revision >= maxEventsbyAggregateID) {
          snapshot.create(database.validateObjectID(data.aggregateId));
        }

        resolve({ aggregateId: database.validateObjectID(data.aggregateId), revision });
      } catch (err) {
        reject(err);
      }
    })();
  });
};

module.exports = saveEvent;
