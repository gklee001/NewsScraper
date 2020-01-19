let express = require("express");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let logger = require("morgan")


let axios = require("axios");
let cheerio = require("cheerio");

let db = require("./models/Article");

let app = express();


app.use(logger("dev"));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static("/public"));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("listening on PORT " + PORT)
})
let linkie = "https://www.nytimes.com"


mongoose.connect("mongodb://mongoscrape:mongoscrape1@ds021694.mlab.com:21694/heroku_6zb42x44", {
    useNewUrlParser: true
});

app.get("/", function (req, res) {
    res.render("index")
})

app.get("/scrape", function (req, res) {
    axios.get(linkie).then(function (response) {
        let $ = cheerio.load(response.data);

        let count = 0;

        $("article h2").each(function (i, element) {
            let result = {};

            if (element.parent.next != null) {
                result.summary = element.parent.next.children[0].data;
                const sLink = element.parent.parent.attribs.href;
                result.title = element.children[0].data;
                result.link = linkie + sLink
            }
            if (typeof result.title !== "undefined") {
                db.create(result).then(function (dbArticle) { console.log(dbArticle) }).catch(function (err) { console.log(err); });
                count++;
            }
            return count < 3;
        });



    });

});

app.get("/articles", function (req, res) {

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

///need to add buttons to save and delete aticles as well as add notes