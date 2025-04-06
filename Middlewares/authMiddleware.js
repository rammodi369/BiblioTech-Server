const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.user.id).select('-password');
      // req.user=decoded.user;
      // console.log("token verified !!");
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const selfAuth= async (req,res,next)=>{
  const {id}= req.params.id;
  const ID = req.user.id;
  try {
    if(id===ID){
      next()
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}



const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const librarian = (req, res, next) => {
  // console.log(req.user);
  if (req.user && (req.user.role === 'admin' || req.user.role === 'librarian')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a librarian' });
  }
};



const authorize = (...roles) => {
  // console.log("Authorization check!!")
  
  return (req, res, next) => {
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    // console.log("User Authorised !!")
    next();
  };
};



module.exports = { protect, admin, librarian ,authorize ,selfAuth};