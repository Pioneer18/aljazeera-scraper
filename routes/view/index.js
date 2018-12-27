const router = require('express').Router();
const db = require('../../models');

//route to render the homepage
router.get('/', function(req, res) {
    //only show the recently scrapped
    db.Articles.find({ saved: false })
        //sort by date before rendering
        .sort({ date: -1 }) 
        .then(function(dbArticles) {
            res.render('index', { articles: dbArticles }); //render the index view with the articles
        });
});

//route to render the saved handlebars page
router.get('/saved', function(req, res) {
    //find only those articles with the saved boolean as true
    db.Articles.find({ saved: true })
        .sort({ date: -1 })
        .then((dbArticles) => {
            res.render('saved', { articles: dbArticles }) //render the saved view with the articles
        })
} )