import express from 'express';
import * as authController from '../controllers/authController.js'; // .js uzantısı ve * as kullanımı önemli

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.put('/update', authController.updateAccount);
router.delete('/delete', authController.deleteAccount);
router.post('/logout', authController.logout);

export default router;