import sequelize from '../config/database.js';
import User from './User.js';
import Author from './Author.js';
import Book from './Book.js';
import BorrowTransaction from './BorrowTransaction.js';
import BorrowRequest from './BorrowRequest.js';


Author.hasMany(Book, { foreignKey: 'author_id', as: 'books' });
Book.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });

User.hasMany(BorrowTransaction, { foreignKey: 'user_id', as: 'borrowedBooks' });
BorrowTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'member' });

User.hasMany(BorrowTransaction, { foreignKey: 'issued_by', as: 'issuedTransactions' });
BorrowTransaction.belongsTo(User, { foreignKey: 'issued_by', as: 'librarian' });

Book.hasMany(BorrowTransaction, { foreignKey: 'book_id', as: 'transactions' });
BorrowTransaction.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });


User.hasMany(BorrowRequest, { foreignKey: 'user_id', as: 'borrowRequests' });
BorrowRequest.belongsTo(User, { foreignKey: 'user_id', as: 'requester' });

Book.hasMany(BorrowRequest, { foreignKey: 'book_id', as: 'borrowRequests' });
BorrowRequest.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

User.hasMany(BorrowRequest, { foreignKey: 'reviewed_by', as: 'reviewedRequests' });
BorrowRequest.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

export {
  sequelize,
  User,
  Author,
  Book,
  BorrowTransaction,
  BorrowRequest
};
