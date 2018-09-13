var mongoose = require("mongoose");
//save a reference to the Schema constructor
var Schema = mongoose.Schema;

//create a new schema object
var ArticleSchema = new Schema({
    topic:{
        type: String,
        required:true
    },
    title: {
        type: String,
        required: true //don't want anything without a title
    },
    link: {
        type: String,
        required: true
    },
    desc: {
        type:String,
        required:false
    },
    time:{
        type:Date,
        requireed:false
    },
    note: {
        type:Schema.Types.ObjectId,
        ref: "Note"
    }
});

//this creates the model, Article, from the schmea above. This is the mongoose model method
var Article = mongoose.model("Article", ArticleSchema);
//export the model (to the index.js)
module.exports = Article;