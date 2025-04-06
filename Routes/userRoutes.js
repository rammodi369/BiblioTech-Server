const express= require('express');
const router= express.Router();
const userController=require('../Controllers/userController');
const authController= require('../Controllers/authController');
const authMiddleware =require('../Middlewares/authMiddleware');


router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);
router.post('/logout',userController.logoutUser);

// Pwd Reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

//Profile
router.get('/profile/:id',authMiddleware.protect,authMiddleware.selfAuth,userController.getUserById);
router.post('/create-payment-intent',userController.paymentHandler);
  
module.exports= router;