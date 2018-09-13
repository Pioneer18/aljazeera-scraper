//require mongoose so we can build a mongoose model schema
var mongoose = require("mongoose");
//save a referecne to the Schema constructor
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;