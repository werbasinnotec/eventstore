# Eventstorage

Eventstorage is a modul to save events by aggregate and aggregateID.

## Usage

### ENV Variables:

-MDBHANDLER_CONSTRING: Defines the connectionstring to the database. Default is: 'mongodb://localhost:27017/mdbtest';

### Start the Eventstore:

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

### Save an events

```
const event = {
  aggregateID: 'ABC',
  aggregate: 'billing',
  context: 'customer',
  hardwrite: false,
  payload: {
    name: 'Wiesmüller',
    firstname: 'Martin'
  }
}

store.saveEvent(event, (err) => {
  if (err) {
    throw err;
  }
});
```

- hardwrite Option: Usually all number fields the system will calc. Set it to true to disable it.

### Create a global snapshot

To create a snaphshot through all the transactions you can use:

```
store.createGlobalSnapshot((err) => {
  if (err) {
    throw err;
  }
  .
  .
  .
  .
});
```

### Create a snapshot by aggregateID

To create a snaphsot by a aggregateID use:

```
store.createAggregateSnapshot('ABC', (err) => {
  if (err) {
    throw err;
  }
  .
  .
  .
});
```

### Get Information between a range by AggregateID

```
const aggregateID = 'ABC';
const min = 1489259072; // Timestamp min
const max = 1489759072; // Timestamp max

store.getAggregateIDInformationbyRange(aggregateID, { min max }, (err) => {
  if (err) {
    throw err;
  }
  .
  .
  .
});
```


### Get the actual Information by AggregateID

```
const aggregateID = 'ABC';

store.getActualAggregateIDInformation(aggregateID, (err, res) => {
  if (err) {
    throw err;
  }

  console.log(res);
});
```

### Get all Information by Aggregate name

```
const aggregate = 'billing';

store.getCompleteAggregateInformation(aggregate, (err, res) => {
  if (err) {
    throw err;
  }

  console.log(res);
});
```

### Destroy an aggregateID

This method destroy the transaction to an aggregateID.

```
const aggregateID = 'ABC';

store.destroyAggregateID(aggregateID, (err) => {
  if (err) {
    throw err;
  }

  .
  .
  .
});
```
