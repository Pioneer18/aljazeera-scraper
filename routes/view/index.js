const router = require('express').Router();
const db = require('../../models');

//route to render the homepage
router.get('/', function(req, res) {
    //only show the recently scrapped
    db.Articles.find({ saved: false })
        //sort by date before rendering
        .sort({ date: -1 }) 
        .then(function(dbArticles) {
            res.render('index', { articles: dbArticles }); //render index view with the articles
        });
});