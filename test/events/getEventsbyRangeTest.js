'use strict';

const assert = require('assertthat');
const getEventsbyRange = require('../../lib/events/getEventsbyRange');
const mdbhandler = require('mongodb-handler');
const ObjectID = require('mongodb').ObjectID;

const testData = [
  { aggregateID: new ObjectID('58c7cacd58c3b54cf2b56f76'),
    aggregate: "billing",
    payload : {
      name : 'Frank'
    },
    context : "person",
    revision : 1,
    timestamp : 1490001056
  },
  { aggregateID: new ObjectID('58c7cacd58c3b54cf2b56f76'),
    aggregate: "billing",
    payload : {
      name : 'Frank',
      lastname: 'Sinatra'
    },
    context : "person",
    revision : 2,
    timestamp : 1490002056
  },
  { aggregateID: new ObjectID('58c7cacd58c3b54cf2b56f76'),
    aggregate: "billing",
    payload : {
      address: {
        street: 'Frankenstreet'
      }
    },
    context : "person",
    revision : 3,
    timestamp : 1490003056
  },
  { aggregateID: new ObjectID('58c7cacd58c3b54cf2b56f76'),
    aggregate: "billing",
    payload : {
      status: {
        married: true
      }
    },
    context : "person",
    revision : 4,
    timestamp : 1490004056
  }
];

describe('getEventsbyRange...', () => {
  it('... is of type function', (done) => {
    assert.that(getEventsbyRange).is.ofType('function');
    done();
  });

  it('... callbacks an error when AggregateID is not defined', (done) => {
    getEventsbyRange(undefined, undefined, undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... callbacks an error when min is not defined', (done) => {
    getEventsbyRange('ABC', undefined, undefined, (err) => {
      assert.that(err).is.equalTo('Error in typof min parameter. Parameter is missing or in not correct format');
      done();
    });
  });

  it('... callbacks an error when min is not in correct format number', (done) => {
    getEventsbyRange('ABC', 'ABC', undefined, (err) => {
      assert.that(err).is.equalTo('Error in typof min parameter. Parameter is missing or in not correct format');
      done();
    });
  });

  it('... callbacks an error when max is not defined', (done) => {
    getEventsbyRange('ABC', 1, undefined, (err) => {
      assert.that(err).is.equalTo('Error in typof min parameter. Parameter is missing or in not correct format');
      done();
    });
  });

  it('... callbacks an error when max is not in correct format number', (done) => {
    getEventsbyRange('ABC', 1, 'ABC', (err) => {
      assert.that(err).is.equalTo('Error in typof min parameter. Parameter is missing or in not correct format');
      done();
    });
  });

  it('... callbacks an error when min is greater as the max parameter', (done) => {
    getEventsbyRange('ABC', 10, 9, (err) => {
      assert.that(err).is.equalTo('Error in definition of the range. The min parameter is greater as than max');
      done();
    });
  });

  it('... create Testdata', (done) => {
    mdbhandler.bulk({ collection: 'events', doc: testData }, (err) => {
      if (err) {
        throw err;
      }

      done();
    })
  });

  it('... callbacks the correct complete data', (done) => {
    getEventsbyRange('58c7cacd58c3b54cf2b56f76', 1490001056, 1490009056, (err, res) => {
      if (err) {
        throw err;
      }

      console.log(res)
      assert.that(res.length).is.equalTo(4);
      done();
    });
  });

  it('... callbacks the correct data with range', (done) => {
    getEventsbyRange('58c7cacd58c3b54cf2b56f76', 1490002056, 1490009056, (err, res) => {
      if (err) {
        throw err;
      }

      console.log(res)
      assert.that(res.length).is.equalTo(3);
      done();
    });
  });
});
