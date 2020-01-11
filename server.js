const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan")

//scraping tools
//axios is promised-based http library
const axios = require("axios");
const cheerio = require("cheerio");

//require all models
const db = require("./models");
const PORT = 3000;

//initalize express
const app = express();

//configure middleware
//use morgan logger to log requests
app.use(logger("dev"));
//parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//make public a static folder
app.use(express.static("public"));

//connect to mongoDB
mongoose.connect("mongodb:localhost/", {
    useNewUrlParser: true
});

//routes
//GET route for scrapping
app.get("/scrape", function (req, res) {
    axios.get(" ").then(function (response) {
        let $ = cheerio.load(response.data);
    })
})

//grab every "" within an article tag and do the following:
$(" ").each(function (i, element) {
    //save empty results object
    var result = {};
})
//add the text and href of every link, and save them as properties of the result object
result.x = $(this)
    .children("a")
    .attr("href");

//create a new article using the result object built from scraping
db