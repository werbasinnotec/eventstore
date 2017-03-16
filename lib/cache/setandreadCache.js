'use strict';

// Require NPM Modules
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 86400 });

const setandreadCache = {
  read: (key) => {
    if (!key) {
      throw new Error('Function is called without key');
    }

    return cache.get(key);
  },
  set: (key, value) => {
    if (!key) {
      throw new Error('Function is called without key');
    }

    if (!value) {
      throw new Error('Function is called without value');
    }

    return cache.set(key, value);
  }
};

module.exports = setandreadCache;
