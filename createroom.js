const express = require('express');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb')
//const formidable = require('express-formidable');

// Database password and URL
const dbName = 'UserInfo' 
const dbPass = "hello"
const url= 'mongodb+srv://createRoom:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';


const app = express();
const client = new MongoClient(url,  {keepAlive: 1});

/*app.post("/",  (req, res) => {
    insert(req,res);
   // client.close();
});

async function insert(req, res) {
  try {
      await client.connect();
      var user = {
          username: "Somebody",
          roomID : 100016789
      }
      console.log("MongoDB connected");

      const db = client.db(dbName);
      const collection = db.collection('rooms');

      //db.collection.insertOne(user, (err, res) => {
      collection.insertOne(user, (err,res) => {
          if (err) throw err;
          console.log("1 User added");
      });
    }
    finally {
      await client.close();
}
}

app.listen(3000);
console.log("listening on port " + 3000);*/

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('rooms');

  //This inserts the documents {a:1}...
<<<<<<< Updated upstream
  const insertResult = await collection.insertMany([{ Nicki_mickey: 10012435667 }, { lil_cooljaii: 10000908678 }]);
  console.log('Inserted in rooms =>', insertResult);

=======
  const insertResult = await collection.insertMany([{ Nicki_mickey: 10012435667 }, { lil_cooljaii: 10000908678 }, {student1 : 100788864434}]);
  console.log('Inserted in rooms =>', insertResult);

   //This deletes all instances of document {a:3}..
  /* const deleteResult = await collection.deleteMany({ Nicki_mickey: 10012435667  });
   console.log('Deleted documents =>', deleteResult);
   const deleteResult2 = await collection.deleteMany({ lil_cooljaii: 10000908678 });
   console.log('Deleted documents =>', deleteResult2);
   const deleteResult3 = await collection.deleteMany({ student1 : 100788864434});
   console.log('Deleted documents =>', deleteResult3);*/

>>>>>>> Stashed changes
  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

console.log("Rooms Added");
