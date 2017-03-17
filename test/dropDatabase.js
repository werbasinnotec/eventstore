'use strict';

const MongoClient = require('mongodb').MongoClient;

const dropDatabase = function (callback) {
  MongoClient.connect('mongodb://localhost:27017/mdbtest', (err, db) => {
    if (err) {
      return callback(err);
    }

    db.dropDatabase((err2) => {
      if (err2) {
        return callback(err2);
      }

      callback(null, true);
    });
  });
};

module.exports = dropDatabase;
