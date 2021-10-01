const { MongoClient } = require('mongodb');


// Connection URL

//Name of MongoDB is CSE442
//mongodb+srv://CSE442:<password>@cluster0.k7tia.mongodb.net/test
const dbPass = process.env.DB_PASS_442
/*console.log("Before")
console.log(dbPass);
console.log("After")*/
const url = 'mongodb+srv://CSE442:' + dbPass + '@cluster0.k7tia.mongodb.net/test';
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
    const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { test: 10 }]);
    console.log('Inserted documents =>', insertResult);

    //This deletes all instances of document {a:3}..
    const deleteResult = await collection.deleteMany({ a: 1 });
    console.log('Deleted documents =>', deleteResult);
    const deleteResult2 = await collection.deleteMany({ a: 2 });
    console.log('Deleted documents =>', deleteResult2);
    const deleteResult3 = await collection.deleteMany({ a: 3 });
    console.log('Deleted documents =>', deleteResult3);

//Using this throws an error
//    const deleteResult = await collection.deleteMany([{ a: 2 }, { a: 3 }]);
//    console.log('Deleted documents =>', deleteResult);

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
/*
var axios = require("axios").default;

var options = {
    method: 'GET',
    url: 'https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/tt1375666',
    headers: {
        'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
        'x-rapidapi-key': '030615605dmsh1d6c732339663dcp17d9a2jsn553d9866ca9f'
    }
};

axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});
*/
console.log("Commit test");