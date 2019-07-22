'use strict';

const assert = require('assertthat');
const path = require('path');
const events = require(path.resolve('./lib/events'));
const snapshots = require(path.resolve('./lib/snapshots'));
const database = require(path.resolve('./lib/database'));

describe('snapshots.create...', () => {
  it('... is of type function', (done) => {
    assert.that(snapshots.create).is.ofType('function');
    done();
  });

  it('... resolves true when process is done. Snapshot must be correct', (done) => {
    (async () => {
      try {
        const aggregateId = '5d31cae67057d69a7b957965';

        await events.saveEvent({
          aggregateId,
          aggregate: 'person',
          context: 'unittest',
          payload: {
            firstName: 'Max',
            legalName: 'Mustermann'
          }
        });

        await events.saveEvent({
          aggregateId,
          aggregate: 'person',
          context: 'unittest',
          payload: {
            firstName: 'Max Michael',
            address: {
              street: 'Max-Eyth-Straße 42'
            }
          }
        });

        await snapshots.create();

        const data = await database.snapshot().find({ aggregateId: database.validateObjectID(aggregateId) }).toArray();

        assert.that(data.length).is.equalTo(1);
        assert.that(data[0].payload.legalName).is.equalTo('Mustermann');
        assert.that(data[0].payload.address.street).is.equalTo('Max-Eyth-Straße 42');
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  it('... resolves true when process is done. Snapshot must be correct with hardwrite', (done) => {
    (async () => {
      try {
        const aggregateId = '5d31cd126e62cb9b19d4ce04';

        await events.saveEvent({
          aggregateId,
          aggregate: 'person',
          context: 'unittest',
          payload: {
            legalName: 'Mustermann'
          }
        });

        await events.saveEvent({
          aggregateId,
          aggregate: 'person',
          context: 'unittest',
          hardwrite: true,
          payload: {
            firstName: 'Max Michael',
            lastName: 'Beckenbauer',
            address: {
              street: 'Max-Eyth-Straße 42'
            }
          }
        });

        await snapshots.create();

        const data = await database.snapshot().find({ aggregateId: database.validateObjectID(aggregateId) }).toArray();

        assert.that(data.length).is.equalTo(1);
        assert.that(data[0].payload.firstName).is.equalTo('Max Michael');
        assert.that(data[0].payload.lastName).is.equalTo('Beckenbauer');
        assert.that(data[0].payload.address.street).is.equalTo('Max-Eyth-Straße 42');
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
