

function find_User() {
    var search = document.getElementById("user_Search");
    if (search == null){
        console.log("Empty");
        document.getElementById("Search_popup").innerHTML = "Enter a username";
    }
    else{
        document.getElementById("Search_popup").innerHTML = "";
        //
    }
}