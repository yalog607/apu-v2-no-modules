const router = require('express').Router();
const apiController = require('../controllers/apiController');
const middlewareCheckToken = require('../middleware/middlewareCheckToken');

// GET
// router.get('/get/profile/info', middlewareCheckToken.checkTokenWhenGoHome, apiController.profile);
// router.get('/get/service/facebook/like-post-sale/list', middlewareCheckToken.checkTokenWhenGoHome, apiController.likePostSaleList);
// router.get('/get/service/facebook/sub-vip/list', middlewareCheckToken.checkTokenWhenGoHome, apiController.subVipList);

// POST
router.post('/service/facebook/like-post-sale/order', middlewareCheckToken.checkTokenWhenGoHome, apiController.likePostSaleOrder);
router.post('/service/facebook/sub-vip/order', middlewareCheckToken.checkTokenWhenGoHome, apiController.subVipOrder);

module.exports = router;
