'use strict';

const database = require('../database');
const cache = require('../cache');
const _ = require('lodash');
const logger = require('../logger');

const create = async (aggregate) => {
  return new Promise((resolve) => {
    if (!aggregate) {
      logger.info('Starting Replay for complete eventstore');
    } else {
      logger.info('Starting Replay for aggregate: ' + aggregate);
    }

    (async () => {
      const eventCol = cache.read('eventstore_options').eventsCollectionName || 'events';
      const snapShotCol = cache.read('eventstore_options').snapShotCollectionName || 'snapshots';
      const replayData = [];

      const data = await database.transaction().aggregate([
          {
            $match: {
              $or: [
                {
                  aggregate
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
          }, {
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
        ]).toArray();

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

        payload._id = data[d].aggregateId;

        if (!replayData[data[d].aggregate]) {
          replayData[data[d].aggregate] = [];
        }
        replayData[data[d].aggregate].push(payload);
      }

      for (let r = 0; r < Object.keys(replayData).length; r++) {
        await database.client().collection('replay_' + Object.keys(replayData)[r]).insertMany(replayData[Object.keys(replayData)[r]]);
      }

      resolve(true);
    })();
  });
};

module.exports = create;
