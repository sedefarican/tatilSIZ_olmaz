const express = require('express');
const authController = require('../controllers/authController'); 

const router = express.Router();

router.post('/register', authController.register); // 'register' yerine 'authController.register'
router.post('/login', authController.login);       // 'login' yerine 'authController.login'
router.post('/forgot-password', authController.forgotPassword); // 'forgotPassword' yerine 'authController.forgotPassword'
router.put('/update', authController.updateAccount); // 'updateAccount' yerine 'authController.updateAccount'
router.delete('/delete', authController.deleteAccount); // 'deleteAccount' yerine 'authController.deleteAccount'
router.post('/logout', authController.logout);

module.exports = router;