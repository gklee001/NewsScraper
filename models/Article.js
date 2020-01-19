let mongoose = require("mongoose");

let Schema = mongoose.Schema;


let ArticleSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: false
    },

    link: {
        type: String,
        required: true
    }
});

let Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;