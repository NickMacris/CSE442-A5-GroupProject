let message: string = "hello World!!";

//Create new heading 1 element
let heading = document.createElement('h1');

heading.textContent = message;


//Adding heading to document
document.body.appendChild(heading);
