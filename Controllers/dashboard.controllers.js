const Book = require('../Model/bookModel');
const User = require('../Model/userModel');
const BookRequest = require('../Model/BookRequestModel');

// Get dashboard statistics (GET /api/admin/dashboard/stats)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRequests = await BookRequest.countDocuments();
    const pendingRequests = await BookRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await BookRequest.countDocuments({ status: 'approved' });
    const rejectedRequests = await BookRequest.countDocuments({ status: 'rejected' });

    const stats = {
      totalBooks,
      totalUsers,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
