const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    author: { type: String, required: [true, 'Author is required'], trim: true, maxlength: 200 },
    isbn: { type: String, required: [true, 'ISBN is required'], unique: true, trim: true, maxlength: 200 },
    genre: { type: String, trim: true, maxlength: 200 },
    copiesAvailable: { type: Number, required: true, min: [0, 'Copies cannot be negative'], default: 1 },
    shelfLocation: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

bookSchema.index({ title: 1 });

module.exports = mongoose.model('Book', bookSchema);
