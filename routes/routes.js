//dependencies
const express = require('express');
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
router = express.Router();


router.get("/", function(req, res) {
    db.Article.find({})
      .then(dbArticle => {
        var hbsObject = {
          articles: dbArticle
        };
        console.log(hbsObject);
        //render everything from the Article db onto the index.handlebars page for the client view
        res.render("index", hbsObject);
      })
      .catch(err => {
        res.json(err);
      })
    });
  
  
  
  //scrape route will bring back all the articles on the Aljazeera home page and save them in the db and display them
  //on the home page (dynamically with jquery)
  router.get("/scrape", function(req,response){
    // Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
    axios.get("https://www.aljazeera.com/news/").then(function(response) {
  
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);
  
      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("div.top-section-lt").each(function(i, element) {
        
        var base = "https://aljazeera.com";
        // Save the text of the element in a "title" variable
        var topic = $(element).find("div.top-feature-overlay-cont").find("p.big-image-label").text();
  
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var title = $(element).find("div.top-feature-overlay-cont").find("a").find("h2.top-sec-title").text();
        //find the article description
        var link = $(element).find("div.top-feature-overlay-cont").children("a").children("a").attr("href");
        
        var desc = $(element).find("div.top-feature-overlay-cont").find("p.top-sec-desc").text();
  
        
        //insert the article(s) into the db
        db.Article.create({
          topic: topic,
          title: title,
          link: link,
          desc: desc
        }).then((dbArticle)=> {
          //view the added result in the console
            console.log(dbArticle);
          }).catch((err)=>{
            return res.json(err)
          });
  
      });
  

  
  
      //put the scraped data into a table
      
      
      $("div.top-section-rt-s1").each(function(i, element) {
  
        // Save the text of the element in a "title" variable
        var topic = $(element).find("div.topFeature-sblock-wr").find("p.small-image-label").text();
  
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var title = $(element).find("div.topFeature-sblock-wr").find("a").find("h2").text();
        var link = $(element).find("div.topFeature-sblock-wr").children("a").children("a").attr("href");
        //find the article description
        //var img_url = $(element).find("div.topFeature-sblock-wr").find("a").children("img").eq(2).attr('src');
  
        //update the Mongo DB
        db.Article.create({
          topic: topic,
          title: title,
          link: link
        }).then((dbArticle)=> {
          //view the added result in the console
            console.log(dbArticle);
          }).catch((err)=>{
            return res.json(err)
          });
      });
      
      
      $("div.col-sm-7").each(function(i, element) {
  
        // Save the text of the element in a "title" variable
        var topic = $(element).children("p.topics-sec-item-label").children("a").text();
        var time = $(element).children("p.topics-sec-item-label").children("time").text();
  
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var title = $(element).children("a").children("h2").text();
        var link = $(element).children("a").attr("href");
        //find the article description
        //var img_url = $(element).find("div.topFeature-sblock-wr").find("a").children("img").eq(2).attr('src');
        var desc =$(element).children("p.topics-sec-item-p").text();
        
        //update the Mongo DB
        db.Article.create({
          topic: topic,
          title: title,
          link: link,
          desc: desc
        }).then((dbArticle)=> {
          //view the added result in the console
            console.log(dbArticle);
          }).catch((err)=>{
            return res.json(err)
          });
      });
      // Log the results once you've looped through each of the elements found with cheerio
      console.log(results);
      res.send("Scrape Complete");
    });
  });
  //==================================================================================================================================
  //make a route to pull all the articles that have been scrroutered and display them to the user
  router.get("/articles",(req,res)=>{
    //grab them all
    db.Article.find({})
      .then((dbArticle)=>{
        //if the query is good return the JSON of the articles pulled from the db
        res.json(dbArticle);
      })
      .catch((err)=>{
        //return the error if there is one
        res.json(err);
      })
  });
  
  //====================================================================================================================================
  //make a route to delete everything in the scraped articles collection
  router.get("/clear", (req,res)=>{
    //clear everything in the db
    db.Article.deleteMany({})
      .then(()=>{
        consoel.log("deleted");
      })
      .catch((err)=>{
        res.json(err);
      })
  })
  
  //======================================================================================================================================
  //make a route to save the articles
  router.put("/save", (req,res) => {
    console.log(`body: ${req.body}`);
    console.log(`data: ${req.body.data}`)
    db.Saved.insertOne({
      topic: req.body.topic,
      title: req.body.title,
      link: req.body.link,
      desc: req.body.desc
    })
  })


  module.exports = router;