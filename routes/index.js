const router = require('express').Router();
//now import the other routes
const apiRoutes = require('./api');
const viewRoutes = require('./view');

router.use('/api', apiRoutes);
router.use('/', viewRoutes);

//export the router
module.exports = router;