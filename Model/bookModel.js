// const mongoose = require('mongoose');

// const BookSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   author: {
//     type: String,
//     required: true,
//   },
//   isbn: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//   },
//   yearOfPublication: {
//     type: Number,
//     required: true,
//   },
//   coverImageUrl: {
//     type: String,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   availability: {
//     type: String,
//     enum: ['available', 'outOfStock'],
//     default: 'available',
//   },
//   addedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   // would add pastHistory of Books too.
//   // would add History of all booking too.
//   usersHistory: [
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//       borrowedAt: {
//         type: Date,
//         default: Date.now,
//       },
//       returnedAt: {
//         type: Date,
//       },
//     },
//   ],
// },  { timestamps: true });

// const Book = mongoose.model('Book', BookSchema);

// module.exports = Book;
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  yearOfPublication: {
    type: Number,
    required: true,
  },
  coverImageUrl: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  availability: {
    type: String,
    enum: ['available', 'outOfStock'],
    default: 'available',
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pdfUrl: {
    type: String,
  },
  usersHistory: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      borrowedAt: {
        type: Date,
        default: Date.now,
      },
      returnedAt: {
        type: Date,
      },
    },
  ],
}, { timestamps: true });

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;