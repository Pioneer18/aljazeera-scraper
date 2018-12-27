// Controller for scraping articles


var db = require("../models");
//import the scrape function from Scripts
var scrape = require("../scripts/scrape");

module.exports = {
  scrapeArticles: function(req, res) {
    // scrape Aljazeera with 'scrape' script
    return scrape()
      .then(function(articles) {
        // then insert articles into the Articles model
        return db.Articles.create(articles);
      })
      .then(function(dbArticles) {
        //make sure articles were retrieved 
        if (dbArticles.length === 0) {
          res.json({
            message: "There aren't any new articles at the moment, please try again tomorrow."
          });
        }
        else {
          //if articles are retrieved, respond with the number collected
          res.json({
            message: "Added " + dbArticles.length + " new articles."
          });
        }
      })
      .catch(function(err) {
        //log all errors with Morgan 
        res.json({
          message: "Scrape complete!!"
        });
      });
  }
};