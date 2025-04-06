const dotenv =require('dotenv');
const path = require('path');
dotenv.config();
const express = require('express');
const app= express();
const PORT = process.env.PORT||5000;
const connectDB= require('./DB/db');

const userRoutes =require('./Routes/userRoutes');
const bookRoutes =require('./Routes/bookRoutes');
const bookFilterRoutes=require('./Routes/booksFilterRoutes');
const bookRequestRoutes =require('./Routes/bookRequests');
const adminRoutes=require('./Routes/adminRoutes');
const feedbackRoutes=require('./Routes/feedbackRoutes');
const userHistoryRoutes=require('./Routes/userHistoryRoutes');
const questionRoutes=require('./Routes/questionBankRoutes')
const cors = require('cors');

connectDB();


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',userRoutes);
app.use('/api/books',bookRoutes);
app.use('/api/filter/books',bookFilterRoutes)
app.use('/api/book-requests', bookRequestRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/feedback',feedbackRoutes);
app.use('/api/user-history',userHistoryRoutes);
app.use('/api/questions',questionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
  });
  

app.listen(PORT,()=>{
    console.log("Server is running on PORT :",PORT);
})
app.post('/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;
  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const calculatedSignature = hmac.digest('hex');
  if (calculatedSignature === razorpay_signature) {
    res.json({ status: 'success' });
  } else {
    res.status(400).json({ status: 'failure' });
  }
});