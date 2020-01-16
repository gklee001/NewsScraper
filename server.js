const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan")

//scraping tools
//axios is promised-based http library
//it works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

//require all models
const db = require("./models");

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
app.use(express.static("/public"));

//handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("listening on PORT " + PORT)
})


//connect to mongoDB
mongoose.connect("mongodb:localhost/newsScraper", {
    useNewUrlParser: true
});

//routes
//GET route for scrapping
app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
        let $ = cheerio.load(response.data);

        //grab every "" within an article tag and do the following:
        $("article h2").each(function (i, element) {
            //save empty results object
            var result = {};

            //add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            //create a new article using the result object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        //send message to client
        res.send("Scrape Complete");
    });
});

//route for getting all aritcles from the db
app.get("/articles", function (req, res) {
    //grab every document in the Articles collextion
    db.Article.find({})
        .then(function (dbArticle) {
            RegExp.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.get("/articles/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNotes) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNotes.id }, { new: true }):
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("app running on port " + PORT + "!");
});