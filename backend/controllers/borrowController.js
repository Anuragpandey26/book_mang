import { Op } from 'sequelize';
import { Book, User, BorrowTransaction, Author } from '../models/index.js';

export const borrowBook = async (req, res) => {
  try {
    const { book_id, user_id } = req.body;

    if (!book_id || !user_id) {
      return res.status(400).json({ error: 'book_id and user_id are required' });
    }

    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.available_copies <= 0) {
      return res.status(400).json({ error: 'Book not available' });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activeBorrows = await BorrowTransaction.count({
      where: {
        user_id,
        status: 'borrowed'
      }
    });

    if (activeBorrows >= 5) {
      return res.status(400).json({ error: 'Member has reached maximum borrow limit (5 books)' });
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const transaction = await BorrowTransaction.create({
      book_id,
      user_id,
      issued_by: req.user.id,
      issue_date: issueDate,
      due_date: dueDate,
      status: 'borrowed'
    });

    await book.update({
      available_copies: book.available_copies - 1
    });

    const result = await BorrowTransaction.findByPk(transaction.id, {
      include: [
        { model: Book, as: 'book', include: [{ model: Author, as: 'author' }] },
        { model: User, as: 'member', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'librarian', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const transaction = await BorrowTransaction.findByPk(req.params.id, {
      include: [{ model: Book, as: 'book' }]
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    const returnDate = new Date();
    let fineAmount = 0;

    if (returnDate > transaction.due_date) {
      const daysLate = Math.ceil((returnDate - transaction.due_date) / (1000 * 60 * 60 * 24));
      fineAmount = daysLate * 0.50;
    }

    await transaction.update({
      return_date: returnDate,
      fine_amount: fineAmount,
      status: 'returned'
    });

    await transaction.book.update({
      available_copies: transaction.book.available_copies + 1
    });

    const result = await BorrowTransaction.findByPk(transaction.id, {
      include: [
        { model: Book, as: 'book', include: [{ model: Author, as: 'author' }] },
        { model: User, as: 'member', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({
      message: 'Book returned successfully',
      transaction: result,
      fine: fineAmount > 0 ? `$${fineAmount.toFixed(2)}` : 'No fine'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBorrowedBooks = async (req, res) => {
  try {
    const transactions = await BorrowTransaction.findAll({
      where: {
        user_id: req.params.user_id,
        status: 'borrowed'
      },
      include: [
        { model: Book, as: 'book', include: [{ model: Author, as: 'author' }] },
        { model: User, as: 'librarian', attributes: ['id', 'name'] }
      ],
      order: [['issue_date', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBorrowed = async (req, res) => {
  try {
    const transactions = await BorrowTransaction.findAll({
      where: { status: 'borrowed' },
      include: [
        { model: Book, as: 'book', include: [{ model: Author, as: 'author' }] },
        { model: User, as: 'member', attributes: ['id', 'name', 'email', 'phone'] },
        { model: User, as: 'librarian', attributes: ['id', 'name'] }
      ],
      order: [['issue_date', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOverdueBooks = async (req, res) => {
  try {
    const now = new Date();

    const transactions = await BorrowTransaction.findAll({
      where: {
        status: 'borrowed',
        due_date: { [Op.lt]: now }
      },
      include: [
        { model: Book, as: 'book', include: [{ model: Author, as: 'author' }] },
        { model: User, as: 'member', attributes: ['id', 'name', 'email', 'phone'] }
      ],
      order: [['due_date', 'ASC']]
    });

    const overdueWithFines = transactions.map(t => {
      const daysLate = Math.ceil((now - t.due_date) / (1000 * 60 * 60 * 24));
      const currentFine = daysLate * 0.50;

      return {
        ...t.toJSON(),
        days_overdue: daysLate,
        current_fine: `$${currentFine.toFixed(2)}`
      };
    });

    res.json(overdueWithFines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
