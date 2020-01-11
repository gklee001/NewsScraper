var mongoose = require("mongoose");

//save a reference to the schema constructor
var Schema = mongoose.Schema;

//using schema contructor, create a new UserSchema object
var ArticleSchema = new Schema({
    //'title is required and of type String
    title: {
        type: String,
        required: true
    },
    // 'link' is required and of type string
    link: {
        type: String,
        required: true
    },
    //not is an object that stores a Note ID
    //ref property links the ObjectId to the Note model
    //this allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});
//this creates our model from the above schema using mongoose
var Article = mongoose.model("Article", ArticleSchema);

//export the Article model
module.exports = Article;