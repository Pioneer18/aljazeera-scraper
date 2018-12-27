//Comments Controlelr

const db = require('../models');

module.exports = {
    // Find a specific comment
    find: function(req, res) {
      db.Comments.find({ _headlineId: req.params.id }).then(function(dbNote) {
        res.json(dbComment);
      });
    },
    // Create a new note
    create: function(req, res) {
      db.Comments.create(req.body).then(function(dbComment) {
        res.json(dbComment);
      });
    },
    // Delete a note with a given id
    delete: function(req, res) {
      db.Comments.remove({ _id: req.params.id }).then(function(dbNote) {
        res.json(dbComment);
      });
    }
  };