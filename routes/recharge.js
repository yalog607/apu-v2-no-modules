const router = require('express').Router();
const rechargeController = require('../controllers/rechargeController');
const middlewareCheckToken = require('../middleware/middlewareCheckToken');

router.get('/banking', middlewareCheckToken.checkTokenWhenGoHome, rechargeController.renderBanking);
router.get('/api/momo', middlewareCheckToken.checkTokenWhenGoHome, rechargeController.getBank);

module.exports = router;
