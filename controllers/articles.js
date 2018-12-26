//controller for articles
//the routes rely on the controllers

const db = require('../models');

module.exports = {
    // Find all the articles and sort by date before returning
  findAll: function(req, res) {
    db.Articles
      .find(req.query)
      .sort({ date: -1 })
      .then(function(dbArticle) {
        res.json(dbArticle);
      });
  },
  // Delete the given article
  delete: function(req, res) {
    db.Articles.remove({ _id: req.params.id }).then(function(dbArticle) {
      res.json(dbArticle);
    });
  },
  // Update the given article
  update: function(req, res) {
    db.Articles.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }).then(function(dbArticle) {
      res.json(dbArticle);
    });
  }
}