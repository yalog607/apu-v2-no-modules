const router = require('express').Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.renderIndex);
router.get("*", indexController.render404);

module.exports = router;
