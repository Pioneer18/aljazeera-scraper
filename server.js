var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

//====================database config with mongoose=========================
//=================define local MongoDB URI ================================
var databaseUri = "mongodb://localhost"