var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const routes = require('./routes/routes');

var PORT = process.env.PORT || 3000;

//Now initialize express
var app = express();

//routing
app.use('/', routes);

//set express-handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
    extended: false
}));
//serve public folder as a static directory
app.use(express.static("public"));

//if deployed use the heroku db, otherwise use the local aljazeera2 db (which is actually defined right here)
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/aljazeera2"

//====================database config with mongoose=========================
//=================define local MongoDB URI ================================

//set mongoose to leverage built in Javascript ES6 Promise
mongoose.Promise = Promise;
//connect to Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



//start the server
app.listen(PORT, function(){
    console.log("App running on port" + PORT + ".");
});