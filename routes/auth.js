const router = require('express').Router();
const authController = require('../controllers/authController');
const middlewareCheckToken = require('../middleware/middlewareCheckToken');

// Render
router.get('/login', middlewareCheckToken.checkTokenWhenGoAuth, authController.renderLogin);
router.get('/register', middlewareCheckToken.checkTokenWhenGoAuth,authController.renderRegister);
router.get('/forgot-password', middlewareCheckToken.checkTokenWhenGoAuth, authController.renderForgotPassword);

// Handle
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.post('/changepass', authController.changePassUser);
router.post('/logout', authController.logoutUser);


module.exports = router;
