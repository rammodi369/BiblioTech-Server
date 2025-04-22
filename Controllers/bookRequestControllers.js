// const BookRequest = require('../Model/BookRequestModel');
// const Book = require('../Model/bookModel');
// const User = require('../Model/userModel');

// // Student creates a book request
// exports.createBookRequest = async (req, res) => {
//   console.log('I am Here');
//   const userId = req.user.id;
//   const { bookId, requestType } = req.body;
//   console.log(requestType);

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     const existingRequest = await BookRequest.findOne({ user: userId, book: bookId, requestType });
//     if (existingRequest) {
//       return res.status(400).json({ message: `${requestType.charAt(0).toUpperCase() + requestType.slice(1)} request already sent to respective authority.` });
//     }

//     const bookRequest = new BookRequest({
//       user: userId,
//       book: bookId,
//       requestType
//     });

//     const savedRequest = await bookRequest.save();
//     res.status(201).json(savedRequest);
//     console.log('req sent!!');
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// // Librarian approves/rejects a book request
// // Respond to a request (PATCH /api/admin/requests/:requestId)
// exports.respondToRequest = async (req, res) => {
//   const { status } = req.body;
//    console.log("Requested.")
//   try {
    
//     const requestInDb = await BookRequest.find({ _id:req.params.id});
//     // console.log(requestInDb);
//     if (!requestInDb) {
//       return res.status(404).json({ message: 'Request not found' });
//     }

//     // Check if the request type is 'borrow' or 'return'
//     if (requestInDb.requestType === 'borrow') {
//       // Handle borrowing request
//       if (status === 'approved') {
//         // Update book quantity and availability
//         const book = await Book.findById(requestInDb.book);
//         if (!book) {
//           return res.status(404).json({ message: 'Book not found' });
//         }
//         if (book.quantity <= 0) {
//           return res.status(400).json({ message: 'Book out of stock' });
//         }
        
//         // Update book availability and quantity
//         book.quantity--;
//         book.availability = book.quantity > 0 ? 'available' : 'outOfStock';
//         await book.save();

//         // Update user's currently borrowing list
//         const user = await User.findById(requestInDb.user);
//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }
//         user.booksBorrowingCurrently.push(requestInDb.book);
//         await user.save();

//         // Update book's history
//         book.usersHistory.push({ user: requestInDb.user, borrowedAt: new Date() });
//         await book.save();
//       }
//     } else if (requestInDb.requestType === 'return') {
//       // Handle return request
//       if (status === 'approved') {
//         // Update book quantity and availability
//         const book = await Book.findById(requestInDb.book);
//         if (!book) {
//           return res.status(404).json({ message: 'Book not found' });
//         }
    
//         // Update book availability and quantity
//         book.quantity++;
//         book.availability = 'available';
//         await book.save();
    
//         // Remove book from user's currently borrowing list
//         const user = await User.findById(requestInDb.user);
//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }
//         const index = user.booksBorrowingCurrently.indexOf(requestInDb.book);
//         if (index !== -1) {
//           user.booksBorrowingCurrently.splice(index, 1);
//           await user.save();
//         }
    
//         // Update book's history for return and impose fine if needed
//         const historyItem = book.usersHistory.find(item => item.user.toString() === requestInDb.user && !item.returnedAt);
//         if (historyItem) {
//           const borrowDate = new Date(historyItem.borrowedAt);
//           const returnDate = new Date();
//           historyItem.returnedAt = returnDate;
//           await book.save();
    
//           const diffTime = Math.abs(returnDate - borrowDate);
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//           if (diffDays > 7) {
//             const fineAmount = (diffDays - 7) * 20;
//             user.fine += fineAmount;
//             await user.save();
//           }
//         }
//       }
//     }
    
//     // Update request status
//     requestInDb.status = status;
//     requestInDb.responseDate = new Date();
    
//     await BookRequest.findByIdAndUpdate(req.params.id, { status, responseDate: Date.now() }, { new: true });
    
//     res.json(requestInDb);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
    
// };

// // Get all requests (GET /api/admin/requests) and librarian too.
// exports.getAllRequests = async (req, res) => {
//   try {
//     // console.log('I am here ..')
//     const requests = await BookRequest.find()
//     .populate('user', 'username email')
//     .populate('book', 'title author');
//     res.json(requests);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const BookRequest = require('../Model/BookRequestModel');
// const Book = require('../Model/bookModel');
// const User = require('../Model/userModel');

// // Student creates a book request
// exports.createBookRequest = async (req, res) => {
//   const userId = req.user.id;
//   const { bookId, requestType } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     // Check if there's already a pending request for this book by the user
//     const existingPendingRequest = await BookRequest.findOne({
//       user: userId,
//       book: bookId,
//       requestType,
//       status: 'pending',
//     });

//     if (existingPendingRequest) {
//       return res.status(400).json({ message: 'You already have a pending request for this book.' });
//     }

//     // Allow creating a new request if the previous one was rejected or completed
//     const bookRequest = new BookRequest({
//       user: userId,
//       book: bookId,
//       requestType,
//     });

//     const savedRequest = await bookRequest.save();
//     res.status(201).json(savedRequest);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Librarian approves/rejects a book request
// exports.respondToRequest = async (req, res) => {
//   const { status } = req.body;

//   try {
//     const requestInDb = await BookRequest.findById(req.params.id);
//     if (!requestInDb) {
//       return res.status(404).json({ message: 'Request not found' });
//     }

//     if (requestInDb.requestType === 'borrow') {
//       if (status === 'approved') {
//         const book = await Book.findById(requestInDb.book);
//         if (!book) {
//           return res.status(404).json({ message: 'Book not found' });
//         }
//         if (book.quantity <= 0) {
//           return res.status(400).json({ message: 'Book out of stock' });
//         }

//         book.quantity--;
//         book.availability = book.quantity > 0 ? 'available' : 'outOfStock';
//         await book.save();

//         const user = await User.findById(requestInDb.user);
//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }
//         user.booksBorrowingCurrently.push(requestInDb.book);
//         await user.save();

//         book.usersHistory.push({ user: requestInDb.user, borrowedAt: new Date() });
//         await book.save();
//       }
//     } else if (requestInDb.requestType === 'return') {
//       if (status === 'approved') {
//         const book = await Book.findById(requestInDb.book);
//         if (!book) {
//           return res.status(404).json({ message: 'Book not found' });
//         }

//         book.quantity++;
//         book.availability = 'available';
//         await book.save();

//         const user = await User.findById(requestInDb.user);
//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }
//         const index = user.booksBorrowingCurrently.indexOf(requestInDb.book);
//         if (index !== -1) {
//           user.booksBorrowingCurrently.splice(index, 1);
//           await user.save();
//         }

//         const historyItem = book.usersHistory.find(
//           (item) => item.user.toString() === requestInDb.user && !item.returnedAt
//         );
//         if (historyItem) {
//           const borrowDate = new Date(historyItem.borrowedAt);
//           const returnDate = new Date();
//           historyItem.returnedAt = returnDate;
//           await book.save();

//           const diffTime = Math.abs(returnDate - borrowDate);
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//           if (diffDays > 7) {
//             const fineAmount = (diffDays - 7) * 20;
//             user.fine += fineAmount;
//             await user.save();
//           }
//         }
//       }
//     }

//     requestInDb.status = status;
//     requestInDb.responseDate = new Date();
//     await requestInDb.save();

//     res.json(requestInDb);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all requests
// exports.getAllRequests = async (req, res) => {
//   try {
//     const requests = await BookRequest.find()
//       .populate('user', 'username email')
//       .populate('book', 'title author');
//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const BookRequest = require('../Model/BookRequestModel');
// const Book = require('../Model/bookModel');
// const User = require('../Model/userModel');

// // Student creates a book request
// exports.createBookRequest = async (req, res) => {
//   const userId = req.user.id;
//   const { bookId, requestType } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const book = await Book.findById(bookId);
//     if (!book) return res.status(404).json({ message: 'Book not found' });

//     // Check for existing pending requests
//     const existingPendingRequest = await BookRequest.findOne({
//       user: userId,
//       book: bookId,
//       status: 'pending',
//     });
//     if (existingPendingRequest) {
//       return res.status(400).json({ message: 'You already have a pending request for this book.' });
//     }

//     // Allow new request only if the last request was rejected or completed
//     const lastRequest = await BookRequest.findOne({ user: userId, book: bookId }).sort({ createdAt: -1 });
//     if (lastRequest && lastRequest.status === 'pending') {
//       return res.status(400).json({ message: 'You have an unresolved request for this book.' });
//     }

//     const bookRequest = new BookRequest({ user: userId, book: bookId, requestType });
//     const savedRequest = await bookRequest.save();
//     res.status(201).json(savedRequest);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Librarian approves/rejects a book request
// exports.respondToRequest = async (req, res) => {
//   const { status } = req.body;

//   try {
//     const request = await BookRequest.findById(req.params.id);
//     if (!request) return res.status(404).json({ message: 'Request not found' });

//     const book = await Book.findById(request.book);
//     const user = await User.findById(request.user);
//     if (!book || !user) return res.status(404).json({ message: 'Book or User not found' });

//     if (request.requestType === 'borrow' && status === 'approved') {
//       if (book.quantity <= 0) return res.status(400).json({ message: 'Book out of stock' });
      
//       book.quantity--;
//       book.availability = book.quantity > 0 ? 'available' : 'outOfStock';
//       book.usersHistory.push({ user: user._id, borrowedAt: new Date() });
//       await book.save();

//       user.booksBorrowingCurrently.push(book._id);
//       await user.save();
//     }

//     if (request.requestType === 'return' && status === 'approved') {
//       book.quantity++;
//       book.availability = 'available';
//       await book.save();

//       user.booksBorrowingCurrently = user.booksBorrowingCurrently.filter(b => b.toString() !== book._id.toString());
//       user.booksBorrowed.push(book._id);
//       await user.save();

//       // Update borrow history
//       const historyItem = book.usersHistory.find(entry => entry.user.toString() === user._id.toString() && !entry.returnedAt);
//       if (historyItem) {
//         const borrowDate = new Date(historyItem.borrowedAt);
//         const returnDate = new Date();
//         historyItem.returnedAt = returnDate;
//         await book.save();

//         // Fine calculation (after 7 days)
//         const daysBorrowed = Math.ceil((returnDate - borrowDate) / (1000 * 60 * 60 * 24));
//         if (daysBorrowed > 7) {
//           user.fine += (daysBorrowed - 7) * 20;
//           await user.save();
//         }
//       }
//     }

//     request.status = status;
//     request.responseDate = new Date();
//     await request.save();
//     res.json(request);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all requests
// exports.getAllRequests = async (req, res) => {
//   try {
//     const requests = await BookRequest.find()
//       .populate('user', 'username email')
//       .populate('book', 'title author');
//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const BookRequest = require('../Model/BookRequestModel');
const Book = require('../Model/bookModel');
const User = require('../Model/userModel');

// Student creates a book request
exports.createBookRequest = async (req, res) => {
  const userId = req.user.id;
  const { bookId, requestType } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check if user already borrowed this book
    const isAlreadyBorrowing = user.booksBorrowingCurrently.some(
      (bId) => bId.toString() === bookId
    );
    if (isAlreadyBorrowing) {
      return res.status(400).json({ message: 'You are already borrowing this book.' });
    }

    // Check borrowing limit
    if (user.booksBorrowingCurrently.length >= 3) {
      return res.status(400).json({ message: 'Borrowing limit reached. Return some books to borrow new ones.' });
    }

    // Check for existing pending requests
    const existingPendingRequest = await BookRequest.findOne({
      user: userId,
      book: bookId,
      status: 'pending',
    });
    if (existingPendingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this book.' });
    }

    // Allow new request only if the last request was rejected or completed
    const lastRequest = await BookRequest.findOne({ user: userId, book: bookId }).sort({ createdAt: -1 });
    if (lastRequest && lastRequest.status === 'pending') {
      return res.status(400).json({ message: 'You have an unresolved request for this book.' });
    }

    const bookRequest = new BookRequest({ user: userId, book: bookId, requestType });
    const savedRequest = await bookRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Librarian approves/rejects a book request
exports.respondToRequest = async (req, res) => {
  const { status } = req.body;

  try {
    const request = await BookRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const book = await Book.findById(request.book);
    const user = await User.findById(request.user);
    if (!book || !user) return res.status(404).json({ message: 'Book or User not found' });

    if (request.requestType === 'borrow' && status === 'approved') {
      if (book.quantity <= 0) return res.status(400).json({ message: 'Book out of stock' });

      // Additional check to prevent bypass
      if (user.booksBorrowingCurrently.length >= 3) {
        return res.status(400).json({ message: 'Borrowing limit reached. Return previous books first.' });
      }
      const alreadyBorrowing = user.booksBorrowingCurrently.some(
        (bId) => bId.toString() === book._id.toString()
      );
      if (alreadyBorrowing) {
        return res.status(400).json({ message: 'User is already borrowing this book.' });
      }

      book.quantity--;
      book.availability = book.quantity > 0 ? 'available' : 'outOfStock';
      book.usersHistory.push({ user: user._id, borrowedAt: new Date() });
      await book.save();

      user.booksBorrowingCurrently.push(book._id);
      await user.save();
    }

    if (request.requestType === 'return' && status === 'approved') {
      book.quantity++;
      book.availability = 'available';
      await book.save();

      user.booksBorrowingCurrently = user.booksBorrowingCurrently.filter(
        (b) => b.toString() !== book._id.toString()
      );
      user.booksBorrowed.push(book._id);
      await user.save();

      // Update borrow history
      const historyItem = book.usersHistory.find(
        (entry) => entry.user.toString() === user._id.toString() && !entry.returnedAt
      );
      if (historyItem) {
        const borrowDate = new Date(historyItem.borrowedAt);
        const returnDate = new Date();
        historyItem.returnedAt = returnDate;
        await book.save();

        // Fine calculation (after 7 days)
        const daysBorrowed = Math.ceil((returnDate - borrowDate) / (1000 * 60 * 60 * 24));
        if (daysBorrowed > 7) {
          user.fine += (daysBorrowed - 7) * 20;
          await user.save();
        }
      }
    }

    request.status = status;
    request.responseDate = new Date();
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find()
      .populate('user', 'username email')
      .populate('book', 'title author');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
