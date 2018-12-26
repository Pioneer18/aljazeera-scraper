//Articles model

//Require mongoose
const mongoose = require('mongoose');

//create the schema class
const Schema = mongoose.Schema;

//create a new schema object for the ArticlesSchema
const commentsSchema = new Schema({
    //associate the comment with a specific article id
    topic: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: { index: { unique: true} } //no duplicate articles
    },
    link: {
        type: String,
        required: true //must be a link to the actual news article
    },
    summary: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false, //every pulled article won't have a date
    },
    saved: {
        type: Boolean, 
        default: false
    }
});

//create Articles model
const Articles = mongoose.model('Articles', ArticlesSchema);
//export the model to models' index.js
module.exports = Articles;
