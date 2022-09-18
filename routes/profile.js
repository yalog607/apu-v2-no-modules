const router = require('express').Router();
const profileController = require('../controllers/profileController');
const middlewareCheckToken = require('../middleware/middlewareCheckToken');

router.get('/info', middlewareCheckToken.checkTokenWhenGoHome, profileController.renderInfo);
router.get('/upgrade-level', middlewareCheckToken.checkTokenWhenGoHome, profileController.renderUpgradeLevel);

module.exports = router;
