const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const Port  = process.env.Port || 3000

console.log("Page Running");

const formidable = require('express-formidable');
app.use(formidable());

//Handlebars init.
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs({
  defaultLayout: 'test',
  extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('test_home' ,{
    Search_bar: {
          feedback:"Nothing Yet"
      }
  }
  );

});

//run server on port
app.listen(Port,()=> {
  console.log(`Server started on ${Port}`)});
  
//post functions 
app.post('/request',(req, res) => {
  var search = req.fields.input_text;
  res.render('test_home' ,{
    Search_bar: {
          feedback:search
      }
  }
  );
  console.log("Should have sent back"+search);
});