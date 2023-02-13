var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);


var db = new sqlite3.Database('./database/parth_raval_c0854965.db');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/form.html'));
});


// View
app.post('/view', function(req,res){
  db.serialize(()=>{
    db.each('select Shelf.ShelfLocation ShelfLocation, Bin.BinID BinID, PartNumber.PartNumber PartNumber FROM PartNumber  INNER JOIN Bin ON PartNumber.BinID=Bin.BinID INNER JOIN Shelf ON Shelf.ShelfID=Bin.ShelfID WHERE PartNumber = ?', [req.body.part_number], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` BinID: ${row.BinID},    ShelfLocation: ${row.ShelfLocation} ,    PartNumber: ${row.PartNumber}`);
      console.log("Entry displayed successfully");
    });
  });
});


// Closing the database connection.
app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });

});



server.listen(1000, function(){
  console.log("server is listening on port: 1000");
});

