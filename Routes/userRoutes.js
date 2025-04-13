const express= require('express');
const router= express.Router();
const userController=require('../Controllers/userController');
const authController= require('../Controllers/authController');
const authMiddleware =require('../Middlewares/authMiddleware');
const { protect, authorize } = require('../Middlewares/authMiddleware');    

router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);
router.post('/logout',userController.logoutUser);

// Pwd Reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

//Profile
router.get('/profile/:id',authMiddleware.protect,authMiddleware.selfAuth,userController.getUserById);
router.post('/create-payment-intent',userController.paymentHandler);
router.post('/reset-fine', 
    protect, 
    async (req, res) => {
        console.log('reset fine');
      try {
        const user = await User.findById(req.user.id);
        console.log(user);
        user.fine = 0;
        await user.save();
        res.json({ user });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Example webhook handler
router.post('/stripe-webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      // Find user by metadata (add metadata when creating payment intent)
      await User.updateOne(
        { _id: paymentIntent.metadata.userId },
        { $set: { fine: 0 } }
      );
    }
  
    res.json({ received: true });
  });
module.exports= router;