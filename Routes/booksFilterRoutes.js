const express = require('express');
const {getLatestBooks} = require('../Controllers/bookControllers');

const { protect } = require('../Middlewares/authMiddleware');


const router = express.Router();
router.route('/latest-books').get(protect,getLatestBooks);


module.exports = router;
