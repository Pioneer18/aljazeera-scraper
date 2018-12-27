//route for handling the comments
const router = require("express").Router();
//import the comments controller
const commentsController = require("../../controllers/comments");

router.get("/:id", commentsController.find); //find a specific comment
router.post("/", commentsController.create); //create a comment on a given article
router.delete("/:id", commentsController.delete); //delete a specific comment

//export the router
module.exports = router;
