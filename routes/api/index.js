//import the express Router
const router = require('express').Router();
//import the other api routes to be exported
const axiosRoutes = require('./axios');
const clearRoutes = require('./clear');
const articlesRoutes = require('./articles');
const commentsRoutes = require('./comments');

router.use('/axios', axiosRoutes);
router.use('/clear', clearRoutes);
router.use('/articles', articlesRoutes);
router.use('/comments', commentsRoutes);

//export the router
module.exports = router;