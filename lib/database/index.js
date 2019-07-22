'use strict';

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const processenv = require('processenv');

const cache = require('../cache');
const logger = require('../logger');

let db;

const dbErrorMessage = 'No Database is connected';

const wrapper = {
  connect: async () => {
    return new Promise((resolve) => {
      (async () => {
        try {
          db = await MongoClient.connect(processenv('MDBHANDLER_CONSTRING') || 'mongodb://127.0.0.1:27017/test', {
            useNewUrlParser: true
          });

          db = await db.db();

          logger.info('Connection to Mongodb successfully established!');

          resolve(db);
        } catch (err) {
          throw err;
        }
      })();
    });
  },

  client: () => {
    if (!db) {
      throw new Error(dbErrorMessage);
    }

    return db;
  },

  transaction: () => {
    if (!db) {
      throw new Error(dbErrorMessage);
    }

    const transCol = cache.read('eventstore_options').transactionsCollectionName || 'transactions';
    const transQuery = db.collection(transCol);

    return transQuery;
  },

  event: () => {
    if (!db) {
      throw new Error(dbErrorMessage);
    }

    const eventCol = cache.read('eventstore_options').eventsCollectionName || 'events';
    const eventQuery = db.collection(eventCol);

    return eventQuery;
  },

  snapshot: () => {
    if (!db) {
      throw new Error(dbErrorMessage);
    }

    const snapShotCol = cache.read('eventstore_options').snapShotCollectionName || 'snapshots';
    const snapQuery = db.collection(snapShotCol);

    return snapQuery;
  },

  validateObjectID: (objectID) => {
    if (!objectID) {
      return null;
    }

    return new ObjectID(objectID.toString());
  }
};

module.exports = wrapper;
