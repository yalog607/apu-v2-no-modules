const router = require('express').Router();
const homeController = require('../controllers/homeController');
const middlewareCheckToken = require('../middleware/middlewareCheckToken');

router.get('/', middlewareCheckToken.checkTokenWhenGoHome, homeController.renderDashboard);

module.exports = router;
