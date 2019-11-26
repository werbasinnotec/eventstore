'use strict';

const database = require('../database');
const cache = require('../cache');
const transactions = require('../transactions');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
const logger = require('../logger');

const create = async (aggregateId) => {
  return new Promise((resolve) => {
    (async () => {
      const eventCol = cache.read('eventstore_options').eventsCollectionName || 'events';
      const snapShotCol = cache.read('eventstore_options').snapShotCollectionName || 'snapshots';
      const snapshots = [];

      logger.debug('Start with Snapshot...');

      database.transaction().aggregate([
        {
          $match: {
            $or: [
              {
                aggregateId
              },
              {
                deleted: false
              },
              {
                deleted: {
                  $exists: false
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: eventCol,
            as: 'events',
            let: {
              aggregateId: '$aggregateId',
              snapShotId: '$lastSnapshotId'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [ '$aggregateId', '$$aggregateId' ]},
                      { $gt: [ '$_id', '$$snapShotId' ]}
                    ]
                  }
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: snapShotCol,
            as: 'snapshot',
            let: {
              aggregateId: '$aggregateId',
              snapShotId: '$lastSnapshotId'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [ '$_id', '$$snapShotId' ]}
                    ]
                  }
                }
              }
            ]
          }
        }
      ], { allowDiskUse: true }).toArray((err, data) => {
        (async () => {
          if (err) {
            throw err;
          }

          for (let d = 0; d < data.length; d++) {
            let payload = {};

              if (data[d].snapshot[0]) {
                payload = data[d].snapshot[0].payload;
              }

              for (let i = 0; i < data[d].events.length; i++) {
                if (data[d].events[i].hardwrite) {
                  payload = data[d].events[i].payload;
                } else {
                  payload = _.mergeWith(payload, data[d].events[i].payload, (objValue, srcValue) => {
                    if (_.isNumber(objValue)) {
                      return _.sum([ objValue, srcValue ]);
                    }
                  });
                }
              }

              if (data[d].events.length > 0) {
                const _id = new ObjectID();

                snapshots.push({
                  _id,
                  aggregateId: data[d].aggregateId,
                  aggregate: data[d].aggregate,
                  context: data[d].context,
                  timestamp: moment().toISOString(),
                  lastEventId: data[d].events[data[d].events.length - 1]._id,
                  payload
                });

                await transactions.createOrUpdate({
                  aggregateId: data[d].aggregateId,
                  aggregate: data[d].aggregate,
                  context: data[d].context,
                  timestamp: moment().toISOString(),
                  lastSnapshotId: _id
                });
              }
          }

          if (snapshots.length > 0) {
            await database.snapshot().insertMany(snapshots);
          }

          logger.info('Running Snapshot is done. Amount of created snapshots: ' + snapshots.length);
          resolve(true);
        })();
      });
    })();
  });
};

module.exports = create;
