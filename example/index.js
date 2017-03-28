'use strict';

const eventstore = require('../lib');

const es = eventstore.start();

let i = 0;

const start = () => {
  es.saveEvent({ aggregateID: '58cc4fb453d1ae58de792f27', aggregate: 'billing', context: 'active', payload: { foo: 'bar', count: i }}, (err, res) => {
    if (err) {
      throw err;
    }

    console.log('Event is saved', res);

    i++;

    if (i > 400) {
      return true;
    } else {
      setTimeout(start, 30);
    }
  });
}

setTimeout(() => {
  start();
}, 4000);
