let express = require("express");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let logger = require("morgan")

//scraping tools
//axios is promised-based http library
//it works on the client and on the server
let axios = require("axios");
let cheerio = require("cheerio");

//require all models
let db = require("./models/Article");

//initalize express
let app = express();

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

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let PORT = process.env.PORT || 3900

app.listen(PORT, function () {
    console.log("listening on PORT " + PORT)
})
let linkie = "https://www.nytimes.com"


mongoose.connect("mongodb://newsScraper:newsScraper@ds021694.mlab.com:21694/heroku_6zb42x44", {
    useNewUrlParser: true
});

app.get("/", function (req, res) {
    res.render("index")
})

app.get("/scrape", function (req, res) {
    axios.get(linkie).then(function (response) {
        let $ = cheerio.load(response.data);
        //grab every "" within an article tag and do the following:
        let count = 0;
        $("article h2").each(function (i, element) {
            let result = {};
            count++;
            const sLink = element.parent.parent.attribs.href
            result.title = element.children[0].data
            result.link = linkie + sLink
            if (element.parent.next != null) {
                result.summary = element.parent.next.children[0].data
            }
            console.log(result)
            db.create(result).then(function (dbArticle) { console.log(dbArticle) }).catch(function (err) { console.log(err); });
        });

    });

});

//route for getting all aritcles from the db
app.get("/articles", function (req, res) {
    //grab every document in the Articles collection
    db.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
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

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNotes.id }, { new: true });
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