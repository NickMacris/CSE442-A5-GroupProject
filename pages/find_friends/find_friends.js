window.onload = function(){
  console.log("Page Running");
  const { MongoClient } = require("mongodb");
  // Connection URL : mongodb+srv://CSE442:<password>@cluster0.k7tia.mongodb.net/test
  const dbPass = process.env.DB_PASS_442;
  const uri = 'mongodb+srv://CSE442:' + dbPass + '@cluster0.k7tia.mongodb.net/test';
  const client = new MongoClient(url);
  
  // Database Name
  const dbName = 'UserInfo';
  
  
  var found = []
document.getElementById("friend_button").onclick = function() {find_User()};

function find_User() {
  
  // Send query to db
    var search = document.getElementById("user_Search");
    console.log(search.value);
    if (search == null){
        console.log("Empty");
        document.getElementById("Search_popup").innerHTML = "Enter a username";
        found = [];
    }
    else{
        document.getElementById("Search_popup").innerHTML = "";
        // send user_search to the server
        var user_search = search.innerHTML;
     //   db_find_user(user_search).catch(console.dir);
    }

    //Show users database's return
    if (found == []){
      console.log("No User Found");
    }
    else{
      // loop through 'found' and display every user
      for(user in found){
        console.log(user+"\n");
        document.getElementById("search_results").innerHTML += "Enter a username"; 
      }
    }
    return 0;
}
/*Database functions
async function db_find_user(user_search) {
  try {
    await client.connect();
    const database = client.db(dbName);//Users
    const global_users = database.collection('username');//Global Users
    // Users are stored as [{username: "Username"},{password,"pass"}]
    const query = { username: user_search };
    const users_found = await global_users.findOne(query);
    console.log(users_found);
    for(user in users_found){
      found.push(user)
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}*/

}