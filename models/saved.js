var mongoose = require("mongoose");
//save a reference to the Schema constructor
var Schema = mongoose.Schema;

//create a new schema object
var SavedSchema = new Schema({
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
    }
});

//this creates the model, Article, from the schmea above. This is the mongoose model method
var Saved = mongoose.model("Saved", SavedSchema);
//export the model (to the index.js)
module.exports = Saved;