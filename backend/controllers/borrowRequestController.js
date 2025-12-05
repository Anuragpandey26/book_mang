import { BorrowRequest, Book, User, Author, BorrowTransaction } from '../models/index.js';

export const createBorrowRequest = async (req, res) => {
  try {
    const { book_id } = req.body;
    const user_id = req.user.id;

    
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    
    const existingRequest = await BorrowRequest.findOne({
      where: {
        book_id,
        user_id,
        status: 'pending'
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending request for this book' });
    }


    const activeBorrow = await BorrowTransaction.findOne({
      where: {
        book_id,
        user_id,
        status: 'borrowed'
      }
    });

    if (activeBorrow) {
      return res.status(400).json({ error: 'You have already borrowed this book' });
    }

  
    const activeBorrows = await BorrowTransaction.count({
      where: {
        user_id,
        status: 'borrowed'
      }
    });

    if (activeBorrows >= 5) {
      return res.status(400).json({ error: 'You have reached maximum borrow limit (5 books)' });
    }

    const request = await BorrowRequest.create({
      book_id,
      user_id,
      status: 'pending'
    });

    const result = await BorrowRequest.findByPk(request.id, {
      include: [
        { model: Book, as: 'book', include: [{ model: Author, as: 'author' }] },
        { model: User, as: 'requester', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: Book, as: 'book', include: [{ model: Author, as: 'author' }] },
        { model: User, as: 'reviewer', attributes: ['id', 'name'] }
      ],
      order: [['request_date', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPendingRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.findAll({
      where: { status: 'pending' },
      include: [
        { model: Book, as: 'book', include: [{ model: Author, as: 'author' }] },
        { model: User, as: 'requester', attributes: ['id', 'name', 'email', 'phone'] }
      ],
      order: [['request_date', 'ASC']]
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findByPk(req.params.id, {
      include: [{ model: Book, as: 'book' }]
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

   
    if (request.book.available_copies <= 0) {
      return res.status(400).json({ error: 'Book not available' });
    }

   
    await request.update({
      status: 'approved',
      reviewed_by: req.user.id,
      reviewed_date: new Date()
    });

   
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const transaction = await BorrowTransaction.create({
      book_id: request.book_id,
      user_id: request.user_id,
      issued_by: req.user.id,
      issue_date: issueDate,
      due_date: dueDate,
      status: 'borrowed'
    });


    await request.book.update({
      available_copies: request.book.available_copies - 1
    });

    res.json({
      message: 'Request approved and book issued',
      request,
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { rejection_note } = req.body;

    if (!rejection_note) {
      return res.status(400).json({ error: 'Rejection note is required' });
    }

    const request = await BorrowRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    await request.update({
      status: 'rejected',
      reviewed_by: req.user.id,
      reviewed_date: new Date(),
      rejection_note
    });

    res.json({
      message: 'Request rejected',
      request
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
