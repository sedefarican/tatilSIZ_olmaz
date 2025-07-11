const express = require('express');
const { register,login, forgotPassword,updateAccount, deleteAccount } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/update', updateAccount);
router.delete('/delete', deleteAccount);

module.exports = router;
