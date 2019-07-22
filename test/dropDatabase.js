'use strict';

const MongoClient = require('mongodb').MongoClient;

/* eslint-disable */

const dropDatabase = function (callback) {
  (async () => {
    let db = await MongoClient.connect('mongodb://127.0.0.1:27017/test', {
            useNewUrlParser: true
          });

    db = await db.db();

    await db.dropDatabase();

    console.log('############## TestDB ist dropped sucessfully ##############');
    callback();
  })();
};

module.exports = dropDatabase;
