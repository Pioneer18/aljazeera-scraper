const db = require("../models");

module.exports = {
    //Function to clear the scraped articles from the db
    clearDB: function (req, res) {
        db.Articles.remove({})
            .then(function () {
                //after clearing the articles, be sure to clear the comments
                return db.Comments.remove({});
            })
            .then(function () {
                res.json({ ok: true });
            });
    }
};
