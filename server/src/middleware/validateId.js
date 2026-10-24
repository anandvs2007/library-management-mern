const mongoose = require('mongoose');

module.exports = (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid book id' });
  next();
};
