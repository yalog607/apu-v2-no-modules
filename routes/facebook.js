const router = require('express').Router();
const facebookController = require('../controllers/facebookController');
const middlewareCheckToken = require('../middleware/middlewareCheckToken');

router.get('/like-sale', middlewareCheckToken.checkTokenWhenGoHome, facebookController.renderLikeSale);
router.get('/sub-vip', middlewareCheckToken.checkTokenWhenGoHome, facebookController.renderSubVip);

module.exports = router;
