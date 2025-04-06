const Book = require('../Model/bookModel');
const User = require('../Model/userModel');


// exports.addBook = async (req, res) => {
//   const { title, author, isbn, category, description, yearOfPublication, quantity } = req.body;

//   try {
//     const newBook = new Book({
//       title,
//       author,
//       isbn,
//       category,
//       description,
//       yearOfPublication,
//       quantity,
//       addedBy: req.user.id,
//       availability: quantity > 0 ? 'available' : 'outOfStock',
//     });
//     const book =Book.find({isbn});
//     if(book.length>0){
//       return res.status(404).json({ message: 'Book Already Exists !!' });
//     }
//     const savedBook = await newBook.save();

//     res.status(201).json(savedBook);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getMultipleBooks = async (req, res) =>{
  if (req.method === 'POST') {
    try {
      const { bookIds } = req.body;
      const books = await Book.find({ _id: { $in: bookIds } });
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
exports.addBook = async (req, res) => {
  const { title, author, isbn, category, description, yearOfPublication, quantity } = req.body;

  try {
    // Check if the book already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists!' });
    }

    // Create a new book with the PDF file URL
    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      description,
      yearOfPublication,
      quantity,
      addedBy: req.user.id,
      availability: quantity > 0 ? 'available' : 'outOfStock',
      pdfUrl: req.file ? req.file.path : null, // Add the PDF file path if it exists
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getBooksByIds = async (req, res) => {
  console.log('here');
  try {
    const { bookIds } = req.body; // Expecting an array of book IDs in the request body

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: 'Invalid book IDs' });
    }

    const books = await Book.find({ _id: { $in: bookIds } }).select('title'); // Fetch only titles

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Current page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Number of books per page, default to 10

  try {
    // Count total number of books
    const totalBooks = await Book.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalBooks / limit);

    // Adjust page number to cyclic behavior
    let adjustedPage = page;
    if (adjustedPage < 1) {
      adjustedPage = totalPages;
    } else if (adjustedPage > totalPages) {
      adjustedPage = 1;
    }

    // Calculate how many documents to skip based on adjusted page number
    const skip = (adjustedPage - 1) * limit;

    // Fetch books for the current page
    const books = await Book.find().skip(skip).limit(limit);

    res.json({
      books,
      currentPage: adjustedPage,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(12);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateBook = async (req, res) => {
  try {
    const { title, author, isbn, category, description, yearOfPublication, quantity } = req.body;

    // Check if the updated ISBN already exists in another book
    const existingBook = await Book.findOne({ isbn });
    if (existingBook && existingBook._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'ISBN already exists' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        isbn,
        category,
        description,
        yearOfPublication,
        quantity,
        availability: quantity > 0 ? 'available' : 'outOfStock',
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne({ _id: req.params.id});
    // await book.remove();

    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookHistory = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate('usersHistory.user', 'username email');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book.borrowHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



