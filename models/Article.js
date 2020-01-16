const mongoose = require("mongoose");

//save a reference to the schema constructor
let Schema = mongoose.Schema;

//using schema contructor, create a new UserSchema object
var ArticleSchema = new Schema({
    //'headline' required and of type string
    headline: {
        type: String,
        required: true
    },
    // 'summary' is required and of type string
    summary: {
        type: String,
        required: true
    },
    // 'URL' or 'link' is required and of type string
    link: {
        type: String,
        required: true
    }
});
//this creates our model from the above schema using mongoose
const Article = mongoose.model("Article", ArticleSchema);

//export the Article model
module.exports = Article;