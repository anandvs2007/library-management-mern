const Book = require('../models/Book');
const asyncHandler = require('../middleware/asyncHandler');

const notFound = () => Object.assign(new Error('Book not found'), { status: 404 });

// GET /api/books?page=1&limit=10  (limit is capped at 50)
exports.getBooks = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const [books, total] = await Promise.all([
    Book.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Book.countDocuments(),
  ]);
  res.json({ books, page, limit, total, pages: Math.ceil(total / limit) });
});

exports.getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw notFound();
  res.json(book);
});

exports.createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
});

exports.updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!book) throw notFound();
  res.json(book);
});

exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) throw notFound();
  res.json({ message: 'Book deleted' });
});

// Copies -1, only if at least 1 copy is left
exports.issueBook = asyncHandler(async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, copiesAvailable: { $gt: 0 } },
    { $inc: { copiesAvailable: -1 } },
    { new: true }
  );
  if (!book) {
    const exists = await Book.exists({ _id: req.params.id });
    if (!exists) throw notFound();
    return res.status(400).json({ message: 'No copies available to issue' });
  }
  res.json(book);
});

exports.returnBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, { $inc: { copiesAvailable: 1 } }, { new: true });
  if (!book) throw notFound();
  res.json(book);
});
