# Eventstorage

Eventstorage is a modul to save events by aggregate and aggregateID.

## Usage

### ENV Variables:

-MDBHANDLER_CONSTRING: Defines the connectionstring to the database. Default is: 'mongodb://localhost:27017/mdbtest';

### Start the eventstore:

```
const es = require('innotec-eventstore');

const options = {
  maxEventsbyAggregateID: 300,                // Optional - Defines the max count of events by a aggregateID. Over this the system will create a snapshot.
  eventsCollectionName: 'events',             // Optional - The collection name for the events
  snapShotCollectionName: 'snapshots',        // Optional - The collection name for the snapshots
  transactionsCollectionName: 'transactions', // Optional - The collection name for the transactions
  globalSnapshotScheduler: {                  // Optional - Defines the time when the scheduler runs the global Snapshot
    hour: 3,
    minute: 1,
    second: 0
  }
};

const store = es.start(options);
```

### Breaking Changes from Major 1 to 2

The complete module has been refactored. All methods are callable via async await or promise.

### Save an event

```
const event = {
  aggregateId: 'ABC',
  aggregate: 'billing',
  context: 'customer',
  hardwrite: false,
  payload: {
    name: 'Wiesmüller',
    firstname: 'Martin'
  }
}

(async () => {
  try {
    await store.saveEvent(event);
  } catch (err) {
    throw err;
  }
})();
```

- hardwrite Option: Usually all number fields the system will calc. Set it to true to disable it.

### Create a global snapshot

To create a snaphshot through all the transactions you can use:

```
(async () => {
  try {
    await store.createGlobalSnapshot();
  } catch (err) {
    throw err;
  }
})();
```

### Create a snapshot by aggregateID

To create a snaphsot by a aggregateID use:

```
(async () => {
  try {
    await store.createAggregateIdSnapshot('abc');
  } catch (err) {
    throw err;
  }
})();
```

### Destroy an aggregateID

This method destroy the transaction to an aggregateID.

```
const aggregateId = 'ABC';

(async () => {
  try {
    await store.destroyAggregateId(aggregateId);
  } catch (err) {
    throw err;
  }
})();
```

### Get Events from aggregateId in range

With this method it's possible to fetch all events by aggregateId and timerange

```
const aggregateId = 'ABC';
const min = '2019-04-22T11:14:46.197Z';
const max = '2019-07-22T11:14:46.197Z';

(async () => {
  try {
    const res = await store.getEventsfromAggregateId(aggregateId, min, max);

    .
    .
    .

  } catch (err) {
    throw err;
  }
})();
```

### In case of Fire... :-) Replay data

with this method it's possibe to replay the data from eventstore. You can call the method with aggregate definition or without.

If it's called with aggregate definition the replay will only run in the defined aggregate. Otherwise all transactions will be selected and replayed.

The result from the replay will saved in a new collection who's called: `replay_` + aggreagte.

```
const aggregate = 'person';

(async () => {
  try {
    await store.replayData(aggregate);
  } catch (err) {
    throw err;
  }
})();
```