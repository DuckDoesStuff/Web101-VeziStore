const express = require('express');
const router = express.Router();

const authController = require('./auth-admin.controller');
const googleRouter = require('./auth-admin.google');

router.use('/google', googleRouter);
router.get('/activate/:token', authController.activate);
router.get('/reset-password/:token', authController.reset);
router.post('/reset-password/:token', authController.updatePassword);

router.get('/forgot-password/', authController.forgotPassword);
router.post('/forgot-password/', authController.resetPassword);

router.get('/signin', authController.signin);
router.get('/signup', authController.signup);

router.post('/signin', authController.login);
router.post('/signup', authController.register);

router.get('/logout', authController.logout);

module.exports = router;