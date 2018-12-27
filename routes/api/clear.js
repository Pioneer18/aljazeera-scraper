//route to hanlde clearing all the articles (and comments)
const router = require("express").Router();
//import the clear controller
const clearController = require("../../controllers/clear");

router.get("/", clearController.clearDB);

//export the router
module.exports = router;
