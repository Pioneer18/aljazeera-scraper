//Optimized with
/*
 * all routes and controllers should be imported to reduce cluter on server file 
 *create Scripts folder for general functions
 * Use the global.process.env for attaching the app to ports and accessing databases  //deployment flexibility
 * use Node.js Cluster and PM2 to run several core process at once, for better performance
 * Specify an external service dependency to link to a remote load-balancer (protected database cluster)  //performance
 * use load balancing algorithims with the load balancer (Round Robin)
 * (on Aljazeera Scraper App, use Redis to improve MongoDB load performance; in-memory cache to reduce acess latency)
 * Optimize Mongoose queries (auto indexes generated)   //quickly find documents 
 * Log all errors with Morgan or Winston  // rely on verbose error loging to catch and correct all errors
 * use Query Helper methods to add functionality and avoid unnecessary repated code on querries   //neatly add querry functionality
 * Use Mocha for testing; include a test folder (Unit test)
 * possibly use Async and Await instead of promises - make asynchrounous code seem a little more synchronous
 * place routes in separate module and import
 */

//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

//setup the express app
const app = express();

//use the global.process.env variable to determine port or the local 3000 port
const PORT = process.env.PORT || 3000;

//require the routes
const routes = require('./routes');

//Serve the public folder as a static direcotry with express
app.use(express.static('public'));

//setup the express-handlebars view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use the routes middleware to handle requests
app.use(routes);

//use global.process.env variable to setup the database for flexible deployment as well
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/aljazeeraScraper';

//connect to the Mongo database with mongoose
mongoose.connect(MONGODB_URI);

//set app to listen to the PORT
app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
})