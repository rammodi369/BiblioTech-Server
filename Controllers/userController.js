const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
exports.registerUser = async (req, res) => {
  console.log('Received registration request');
  console.log(req.body);

  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password || !role) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User with this email already exists!" });
    }

    user = new User({
      username,
      email,
      password,
      role // Ensure role is properly set
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    res.status(201).json({ user, message: "Registered Successfully!!!" });
  } catch (err) {
    console.error("Error while registering user", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.loginUser= async(req, res)=>{
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    // console.log(email,password);
    try {
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ mes: "No user found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ mes: "Invalid Credentials !!" });
        }
        const payload={
            user:{
                id:user.id,
                role:user.role,
                username:user.username,
                email:user.email,
                avatar:user?.avatar,
                fine:user?.fine,
                booksBorrowed:user.booksBorrowed,
                booksBorrowingCurrently:user.booksBorrowingCurrently,
            }
        }
        console.log(user);
        user.password=undefined;
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 30000 }, (err, token) => {
            if (err) throw err;
            res.json({ 'user':user ,"token":token});
          });
             

    } catch (err) {
        console.log("Error occured !!", err);
        res.status(500).send("Server Error!!");
      }
}

exports.logoutUser = (req, res) => {
    try {
      res.status(200).json({ msg: 'User logged out successfully' });
    } catch (err) {
      console.error('Error logging out user: ', err);
      res.status(500).send('Server Error');
    }
  };
  exports.markFinePaid = async (req, res) => {
    const { userId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      user.fine = 0;
      await user.save();
  
      res.json({ message: 'Fine cleared successfully', user });
    } catch (error) {
      console.error("Error updating fine:", error);
      res.status(500).json({ error: error.message });
    }
  };


  // USER DETAILS...
  // Get all users (GET /api/admin/users)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID (GET /api/admin/users/:userId)
exports.getUserById = async (req, res) => {
  console.log('here');
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (PATCH /api/admin/users/:userId)
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { username, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (DELETE /api/admin/users/:userId)
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId).select('-password');
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserHistory = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'booksBorrowed',
        select: 'title author usersHistory',
      })
      .populate({
        path: 'booksBorrowingCurrently',
        select: 'title author usersHistory',
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const processBooks = (books) => {
      return books.map(book => {
        // Find the user's entry in the book's usersHistory
        const userEntry = book.usersHistory.find(entry => 
          entry.user && entry.user.toString() === userId
        );
        return {
          title: book.title,
          author: book.author,
          borrowedDate: userEntry ? userEntry.borrowedAt : null,
          returnDate: userEntry ? userEntry.returnedAt : null,
        };
      });
    };

    // Prepare response data with processed books
    const userHistory = {
      username: user.username,
      booksBorrowed: processBooks(user.booksBorrowed),
      booksBorrowingCurrently: processBooks(user.booksBorrowingCurrently),
    };

    res.json(userHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Route: POST /api/auth/mark-fine-paid
exports.markFinePaid = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.fine = 0;
    await user.save();

    res.json({ message: 'Fine cleared successfully', user });
  } catch (error) {
    console.error("Error updating fine:", error);
    res.status(500).json({ error: error.message });
  }
};
// Route: POST /api/auth/create-payment-intent
exports.paymentHandler = async (req, res) => {
  const { amount, user } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      payment_method_types: ['card'],
      description: `Library fine payment for ${user.username}`
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getUserProfileData = async (req, res) => {
  console.log('here');
  try {
    const userId = req.params.id; // ✅ Get from URL params

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId).lean();

    if (!user) return res.status(404).json({ message: "User not found" });

   // const borrowedBooks = await Book.find({ _id: { $in: user.booksBorrowed } });
   // const currentBooks = await Book.find({ _id: { $in: user.booksBorrowingCurrently } });

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fine: user.fine,
      avatar: user.avatar || null,
      booksBorrowed: user.booksBorrowed,
      booksBorrowingCurrently: user.booksBorrowingCurrently,
    });
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
