//route to grab recently scraped articles from db, delete specific article by id,
//and upadte specific article
const router = require('express').Router();
//require the articles controller 
const articleController = require('../../controllers/articles');

router.get('/', articleController.findAll); //find all the recent articles when homepage hit
router.delete('/:id', articleController.delete); //delete an article
router.put('/:id', articleController.update); //update and article

//export the router
module.exports = router;