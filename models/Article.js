let mongoose = require("mongoose");

//save a reference to the schema constructor
let Schema = mongoose.Schema;

//using schema contructor, create a new UserSchema object
let ArticleSchema = new Schema({
    //'headline' required and of type string
    title: {
        type: String,
        required: false
    },
    // 'summary' is required and of type string
    summary: {
        type: String,
        required: false
    },
    // 'URL' or 'link' is required and of type string
    link: {
        type: String,
        required: false
    }
});
//this creates our model from the above schema using mongoose
let Article = mongoose.model("Article", ArticleSchema);

//export the Article model
module.exports = Article;