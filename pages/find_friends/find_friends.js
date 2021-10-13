

function find_User() {
    var search = document.getElementById("user_Search");
    if (search == null){
        console.log("Empty");
        document.getElementById("Search_popup").innerHTML = "Enter a username";
    }
    else{
        document.getElementById("Search_popup").innerHTML = "";
        // send user_search to the server
        var user_search = search.innerHTML;
        
    }
}

const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('');//Users
    const global_users = database.collection('');//Global Users
    // Query for user_search
    const query = { username: user_search };// username: 
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);