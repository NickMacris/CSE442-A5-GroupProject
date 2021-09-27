const { MongoClient } = require('mongodb');


// Connection URL

//Name of MongoDB is CSE442
//Pass is csE442
const url = 'mongodb+srv://CSE442:csE442@cse442.k7tia.mongodb.net/test';
const client = new MongoClient(url);

// Database Name
const dbName = 'SimpleTest';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('documents');

    //This inserts the documents {a:1}...
    const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    console.log('Inserted documents =>', insertResult);

    //This deletes all instances of document {a:3}..
    const deleteResult = await collection.deleteMany({ a: 3 });
    console.log('Deleted documents =>', deleteResult);
    const deleteResult2 = await collection.deleteMany({ a: 2 });
    console.log('Deleted documents =>', deleteResult2);

//Using this throws an error
//    const deleteResult = await collection.deleteMany([{ a: 2 }, { a: 3 }]);
//    console.log('Deleted documents =>', deleteResult);

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());