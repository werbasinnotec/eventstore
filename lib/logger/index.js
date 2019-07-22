'use strict';

/* eslint-disable */
const wrapper = {
  info: (message) => {
    console.log('\x1b[32m', '[EVENTSTORE] - Info =>', message, '\n', '\x1b[0m');
  },

  debug: (message) => {
    console.log('\x1b[35m', '[EVENTSTORE] - Debug =>', message, '\n', '\x1b[0m');
  },

  error: (message) => {
    console.log('\x1b[31m', '[EVENTSTORE] - Error =>', message, '\n', '\x1b[0m');
  },

  fatal: (message) => {
    console.log('\x1b[5m', '[EVENTSTORE] - Fatal Error =>', message, '\n', '\x1b[0m');
  }
};

module.exports = wrapper;