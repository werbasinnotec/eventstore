'use strict';

const mdbhandler = require('mongodb-handler');

const cache = require('../cache/setandreadCache');
const createSnapshotByAggregateID = require('./createSnapshotByAggregateID');

const createGlobalSnapshot = (callback) => {
  const collection = cache.read('eventstore_options').transactionsCollectionName || 'transactions';

  mdbhandler.fetch({ collection, doc: {}}, (err, res) => {
    if (err) {
      return callback(err);
    }

    let i = 0;

    const startProcess = () => {
      createSnapshotByAggregateID(res[i].aggregateID, (err) => {
        if (err) {
          return callback(err);
        }

        i++

        if (i < res.length) {
          startProcess();
        } else {
          callback(null, true);
        }
      });
    };

    startProcess();
  });
};

module.exports = createGlobalSnapshot;
