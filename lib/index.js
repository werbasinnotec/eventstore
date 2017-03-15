'use strict';

const Connection = require('./connect');

module.exports = {
  Connection: Connection,
  start: (options) => {
    const c = new Connection(options);

    c.start();
    return c;
  }
};
