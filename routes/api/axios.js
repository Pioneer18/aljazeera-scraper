//route to scrape (with axios controller) for new articles
const router = require('express').Router();
//require the axios controller
const axiosController = require('../../controllers/axios');

//this route relies on the axios controller and scrape script to pull the latest articles
router.get('/', axiosController.scrapeArticles); 

