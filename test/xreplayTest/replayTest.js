'use strict';

const assert = require('assertthat');
const path = require('path');
const dropDatabase = require('../dropDatabase');
const events = require(path.resolve('./lib/events'));
const database = require(path.resolve('./lib/database'));
const replay = require(path.resolve('./lib/replay'));
const ObjectID = require('mongodb').ObjectID;

const id1 = new ObjectID();
const id2 = new ObjectID();
const id3 = new ObjectID();
const id4 = new ObjectID();

describe('replay.create...', () => {
  it('... is of type function', (done) => {
    assert.that(replay.create).is.ofType('function');
    done();
  });

  it('... drop Database', (done) => {
    dropDatabase(() => done());
  });

  it('... create testData', (done) => {
    (async () => {
      await events.saveEvent({
        aggregateId: id1,
        aggregate: 'vehicle',
        hardwrite: true,
        payload: {
          manufacturer: 'Volvo',
          registration: 'BB-W 1144',
          milage: 1234
        }
      });

      await events.saveEvent({
        aggregateId: id4,
        aggregate: 'person',
        hardwrite: true,
        payload: {
          name: 'Ballack',
          firstName: 'Michael',
          address: {
            street: 'Fuchsenwiese 44',
            city: 'Holzherlingen'
          }
        }
      });

      await events.saveEvent({
        aggregateId: id1,
        aggregate: 'vehicle',
        hardwrite: true,
        payload: {
          manufacturer: 'Volvo',
          registration: 'BB-W 1144',
          milage: 1244
        }
      });

      await events.saveEvent({
        aggregateId: id3,
        aggregate: 'person',
        hardwrite: true,
        payload: {
          name: 'Beckenbauer',
          firstName: 'Franz'
        }
      });

      await events.saveEvent({
        aggregateId: id2,
        aggregate: 'vehicle',
        hardwrite: true,
        payload: {
          manufacturer: 'Mercedes',
          registration: 'N-A 4422',
          milage: 135522
        }
      });

      await events.saveEvent({
        aggregateId: id4,
        aggregate: 'person',
        payload: {
          address: {
            city: 'Bamberg',
            zipCode: '12345'
          }
        }
      });

      await events.saveEvent({
        aggregateId: id3,
        aggregate: 'person',
        payload: {
          name: 'Beckenbauer',
          firstName: 'Franz',
          amountOnAccount: 3000000
        }
      });

      await events.saveEvent({
        aggregateId: id1,
        aggregate: 'vehicle',
        hardwrite: true,
        payload: {
          manufacturer: 'Volvo',
          registration: 'BB-W 1144',
          milage: 12234
        }
      });

      await events.saveEvent({
        aggregateId: id1,
        aggregate: 'vehicle',
        hardwrite: true,
        payload: {
          manufacturer: 'Volvo',
          registration: 'S-T 1234',
          milage: 33224
        }
      });

      await events.saveEvent({
        aggregateId: id3,
        aggregate: 'person',
        payload: {
          name: 'Beckenbauer',
          firstName: 'Franz',
          badBoy: true,
          amountOnAccount: 6000000
        }
      });

      await events.saveEvent({
        aggregateId: id2,
        aggregate: 'vehicle',
        hardwrite: true,
        payload: {
          manufacturer: 'Mercedes',
          registration: 'N-A 4422',
          milage: 553323,
          damage: true
        }
      });

      await events.saveEvent({
        aggregateId: id1,
        aggregate: 'vehicle',
        hardwrite: true,
        payload: {
          customer: 'Beckenbauer',
          manufacturer: 'Volvo',
          registration: 'S-T 1234',
          milage: 33224
        }
      });

      done();
    })();
  });

  it('... must resolve true when replay is done', (done) => {
    (async () => {
      try {
        const res = await replay.create();

        assert.that(res).is.true();
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  it('... the correct data must be replayed', (done) => {
    (async () => {
      try {
        const res = await database.client().collection('replay_person').find({}).toArray();
        const res2 = await database.client().collection('replay_vehicle').find({}).toArray();

        assert.that(res.length).is.equalTo(2);
        assert.that(res2.length).is.equalTo(2);
        assert.that(JSON.stringify(res[0])).is.equalTo(JSON.stringify({
          _id: id4,
          name: 'Ballack',
          firstName: 'Michael',
          address: {
            street: 'Fuchsenwiese 44',
            city: 'Bamberg',
            zipCode: '12345'
          }
        }));

        assert.that(JSON.stringify(res[1])).is.equalTo(JSON.stringify({
          _id: id3,
          name: 'Beckenbauer',
          firstName: 'Franz',
          amountOnAccount: 9000000,
          badBoy: true
        }));

        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
