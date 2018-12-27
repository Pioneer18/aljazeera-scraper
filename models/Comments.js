//Comments Model

//Require mongoose
const mongoose = require('mongoose');

//create the schema class 
const Schema = mongoose.Schema;

//create a new schema object for the commentsSchema
const commentsSchema = new Schema({
    //associate the comment with a specific article id
    _ArticleID: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    date: {
        type: Date,
        default: Date.now //defualt current time
    },
    commentText: String
});

//create Comments model
const Comments = mongoose.model('Comments', commentsSchema);
//export the model to models' index.js
module.exports = Comments;