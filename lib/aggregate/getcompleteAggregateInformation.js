'use strict';

const mdbhandler = require('mongodb-handler');

const cache = require('../cache/setandreadCache');
const getActualAggregateIDInformation = require('../snapshots/getActualAggregateIDInformation');

const getcompleteAggregateInformation = (aggregate, callback) => {
  if (!aggregate) {
    return callback('Function is called without an aggregate');
  }

  const collection = cache.read('eventstore_options').transactionsCollectionName || 'transactions';

  mdbhandler.fetch({ collection, doc: { aggregate }}, (err, transactions) => {
    if (err) {
      return callback(err);
    }

    if (transactions.length === 0) {
      return callback('The named aggregate is not famous in system');
    }

    const response = {};

    for (let i = 0; i < transactions.length; i++) {
      response[transactions[i].context] = [];
    }

    let i = 0;

    const run = () => {
      getActualAggregateIDInformation(transactions[i].aggregateID, (err2, res) => {
        if (err2) {
          return callback(err2);
        }

        res._id = transactions[i].aggregateID;
        response[transactions[i].context].push(res);

        i++;
        if (i < transactions.length) {
          run();
        } else {
          callback(null, response);
        }
      });
    };

    run();
  });
};

module.exports = getcompleteAggregateInformation;
