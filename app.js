const express = require("express");
const app = express();
const ejs = require("ejs");
const url = require("url");
const bodyParser = require('body-parser');

const sql = require("sqlite3").verbose();
const db = new sql.Database("db/posts.db");

const port = 80;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port);


app.get("/", function(req, res) {
   buildHomePage(req,res);
});


app.get("/upload", function(req, res, next) {
   res.render("upload");
});

app.post("/upload", function(req, res) {
   console.log(req.body);
   let data = req.body;
   if(validateData(data)) {
      uploadToDB(data);
   }
   res.send("data recived");
});


app.get("/post/:id", function(req, res) {
   db.get(`SELECT * FROM post WHERE postid = "${req.params.id}";`, function(err, row) {
      if(err != null) {
         console.log("An error has occured getting data from the database: " + err);
         res.send("Database Error");
      } else {
         if(row != null) {
            console.log("ROW: " + row);
            console.log(`Title: ${row.title}, Desc: ${row.desc}, link: ${row.link}`);
            res.render("post", {title: row.title, desc: row.desc, link: row.link}); //row.id + row.image
         } else {
            get404HTML(req,res);
            console.log("row is null");
         }
      }
   });
});

app.get("/test", function(req, res) {
   let link = "image.png";
   if(link.substring(link.length -4).toLowerCase() == ".png" || link.substring(link.length -4).toLowerCase() == ".jpg" || link.substring(link.length -5).toLowerCase() == ".jpeg") {
      res.send("image");
   } else {
      res.send("link");
   }


   res.send("yes");
});

// Must be last
app.all("*", function(req,res) {
   get404HTML(req,res);
});

function get404HTML(req,res) {
   res.send("404 Error");
}

function buildHomePage() {
   res.render("homePage");
}


function validateData(data) {
   return true;
}

function uploadToDB(data) {
   let id="";

   do {
      id = generateRandomID();
      console.log("id: " + id);
   } while((checkPostExists(id)));

   let title = data.title;
   let link = data.link;
   let desc = data.desc;
   let timeStamp = Date.now();
   let upVotes = 0;
   let downVotes = 0;
   db.run(`INSERT INTO post (postid, title, link, desc, postTimeStamp, upVotes, downVotes) VALUES ("${id}", "${title}", "${link}", "${desc}", "${timeStamp}", "${upVotes}", "${downVotes}")`);
}

function generateRandomID(){
   let randomID = "";
   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for(let i=0; i < 10; i++) {
      randomID += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return randomID;
}

function checkPostExists(id) {
      return false;
}

async function checkPostExistsDB(id) {

}