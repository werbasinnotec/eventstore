'use strict';

const _ = require('lodash');

const mergeEventsforSnapshot = (oldPayload, eventslist) => {
  if (!oldPayload) {
    throw new Error('Function is called without old Payload');
  }

  if (!eventslist) {
    throw new Error('Function is called without the eventslist');
  }

  const calculator = (objValue, srcValue) => {
    if (_.isNumber(objValue)) {
      return _.sum([ objValue, srcValue ]);
    }
  };

  let newPayload = oldPayload;

  for (let i = 0; i < eventslist.length; i++) {
    if (eventslist[i].hardwrite) {
      newPayload = _.merge(newPayload, eventslist[i].payload);
    } else {
      newPayload = _.mergeWith(newPayload, eventslist[i].payload, calculator);
    }
  }

  return newPayload;
};

module.exports = mergeEventsforSnapshot;
