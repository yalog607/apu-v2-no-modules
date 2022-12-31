const router = require('express').Router();
const facebookController = require('../controllers/facebookController');
const middlewareCheckToken = require('../middleware/middlewareCheckToken');

router.get('/like-sale', middlewareCheckToken.checkTokenWhenGoHome, facebookController.renderLikeSale);

module.exports = router;
