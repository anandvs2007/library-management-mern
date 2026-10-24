const TEXT_FIELDS = ['title', 'author', 'isbn', 'genre', 'shelfLocation'];
const REQUIRED = ['title', 'author', 'isbn'];

// Validates the body and keeps only known fields (also blocks NoSQL operator objects)
module.exports = (req, res, next) => {
  const body = req.body || {};
  const clean = {};

  for (const field of TEXT_FIELDS) {
    const value = body[field];
    if (value === undefined || value === null || value === '') {
      clean[field] = '';
      continue;
    }
    if (typeof value !== 'string') return res.status(400).json({ message: `${field} must be text` });
    clean[field] = value.trim();
    if (clean[field].length > 200) {
      return res.status(400).json({ message: `${field} is too long (max 200 characters)` });
    }
  }

  for (const field of REQUIRED) {
    if (!clean[field]) return res.status(400).json({ message: `${field} is required` });
  }

  const copies = body.copiesAvailable === undefined ? 1 : Number(body.copiesAvailable);
  if (!Number.isInteger(copies) || copies < 0) {
    return res.status(400).json({ message: 'Copies available must be a whole number, 0 or more' });
  }
  clean.copiesAvailable = copies;

  req.body = clean;
  next();
};
