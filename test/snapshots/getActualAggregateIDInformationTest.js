'use strict';

const assert = require('assertthat');
const createSnapshotByAggregateID = require('../../lib/snapshots/createSnapshotByAggregateID');
const getActualAggregateIDInformation = require('../../lib/snapshots/getActualAggregateIDInformation');
const saveEvent = require('../../lib/events/saveEvent');

describe('getActualAggregateIDInformation...', () => {
  it('... is of type function', (done) => {
    assert.that(getActualAggregateIDInformation).is.ofType('function');
    done();
  });

  it('... callbacks an error when aggregateID is not defined', (done) => {
    getActualAggregateIDInformation(undefined, (err) => {
      assert.that(err).is.equalTo('Function is called without aggregateID');
      done();
    });
  });

  it('... callbacks the correct object when no snapshot is avaiabled', (done) => {
    const obj = {
      aggregateID: '58775355af95ea15098fad5f',
      aggregate: 'usersystem',
      payload: {
        name: 'Wiesmüller',
        firstname: 'Martin'
      },
      context: 'Test'
    };

    saveEvent(obj, (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();

      obj.payload.address = { street: 'Max-Eyth-Str. 42' };

      saveEvent(obj, (err2, res2) => {
        if (err2) {
          throw err2;
        }

        assert.that(res2).is.true();

        getActualAggregateIDInformation('58775355af95ea15098fad5f', (err3, info) => {
          if (err3) {
            throw err3;
          }

          const finalObj = {
            name: 'Wiesmüller',
            firstname: 'Martin',
            address: {
              street: 'Max-Eyth-Str. 42'
            }
          };

          assert.that(info).is.equalTo(finalObj);
          done();
        });
      });
    });
  });

  it('... callbacks the correct object when a snapshot is avaiabled', (done) => {
    createSnapshotByAggregateID('58775355af95ea15098fad5f', (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res).is.true();

      const obj = {
        aggregateID: '58775355af95ea15098fad5f',
        aggregate: 'usersystem',
        payload: {
          address: {
            city: 'Holzgerlingen'
          }
        },
        context: 'Test'
      };

      saveEvent(obj, (err2, res2) => {
        if (err2) {
          throw err2;
        }

        assert.that(res2).is.true();

        getActualAggregateIDInformation('58775355af95ea15098fad5f', (err3, info) => {
          if (err3) {
            throw err3;
          }

          const finalObj = {
            name: 'Wiesmüller',
            firstname: 'Martin',
            address: {
              street: 'Max-Eyth-Str. 42',
              city: 'Holzgerlingen'
            }
          };

          assert.that(info).is.equalTo(finalObj);
          done();
        });
      });
    });
  });
});
