const router = require('express').Router();
const c = require('../controllers/bookController');
const validateBook = require('../middleware/validateBook');
const validateId = require('../middleware/validateId');

router.param('id', validateId);

router.get('/', c.getBooks);
router.post('/', validateBook, c.createBook);
router.get('/:id', c.getBook);
router.put('/:id', validateBook, c.updateBook);
router.delete('/:id', c.deleteBook);
router.patch('/:id/issue', c.issueBook);
router.patch('/:id/return', c.returnBook);

module.exports = router;
