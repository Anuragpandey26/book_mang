import { Op } from 'sequelize';
import { Book, Author, BorrowTransaction } from '../models/index.js';

export const getAllBooks = async (req, res) => {
  try {
    const { title, author, category, available, isbn } = req.query;
    const where = {};

    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (category) where.category = { [Op.iLike]: `%${category}%` };
    if (isbn) where.isbn = isbn;
    if (available === 'true') where.available_copies = { [Op.gt]: 0 };

    const include = [{
      model: Author,
      as: 'author',
      attributes: ['id', 'name']
    }];

    if (author) {
      include[0].where = { name: { [Op.iLike]: `%${author}%` } };
    }

    const books = await Book.findAll({ where, include });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{ model: Author, as: 'author' }]
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      attributes: ['id', 'title', 'total_copies', 'available_copies']
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      book_id: book.id,
      title: book.title,
      total_copies: book.total_copies,
      available_copies: book.available_copies,
      is_available: book.available_copies > 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author_name, isbn, category, publisher, year, total_copies, cover_image } = req.body;

    if (!title || !author_name) {
      return res.status(400).json({ error: 'Title and author_name are required' });
    }

   
    let [author] = await Author.findOrCreate({
      where: { name: author_name.trim() },
      defaults: { name: author_name.trim() }
    });

    const book = await Book.create({
      title,
      author_id: author.id,
      isbn,
      category,
      publisher,
      year,
      total_copies: total_copies || 1,
      available_copies: total_copies || 1,
      cover_image
    });

    const bookWithAuthor = await Book.findByPk(book.id, {
      include: [{ model: Author, as: 'author' }]
    });

    res.status(201).json(bookWithAuthor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author_name, isbn, category, publisher, year, total_copies, available_copies, cover_image } = req.body;

    let author_id = book.author_id;
    
  
    if (author_name) {
      let [author] = await Author.findOrCreate({
        where: { name: author_name.trim() },
        defaults: { name: author_name.trim() }
      });
      author_id = author.id;
    }

    
    const finalTotalCopies = total_copies || book.total_copies;
    const finalAvailableCopies = available_copies !== undefined ? available_copies : book.available_copies;
    
    if (finalAvailableCopies > finalTotalCopies) {
      return res.status(400).json({ error: 'Available copies cannot exceed total copies' });
    }

    await book.update({
      title: title || book.title,
      author_id,
      isbn: isbn !== undefined ? isbn : book.isbn,
      category: category || book.category,
      publisher: publisher || book.publisher,
      year: year || book.year,
      total_copies: finalTotalCopies,
      available_copies: finalAvailableCopies,
      cover_image: cover_image !== undefined ? cover_image : book.cover_image
    });

    const updatedBook = await Book.findByPk(book.id, {
      include: [{ model: Author, as: 'author' }]
    });

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const activeBorrows = await BorrowTransaction.count({
      where: {
        book_id: req.params.id,
        status: 'borrowed'
      }
    });

    if (activeBorrows > 0) {
      return res.status(400).json({ error: 'Cannot delete book with active borrows' });
    }

    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
