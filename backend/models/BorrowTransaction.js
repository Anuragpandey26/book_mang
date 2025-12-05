import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BorrowTransaction = sequelize.define('BorrowTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  issued_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  issue_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fine_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
    defaultValue: 'borrowed'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'borrow_transactions',
  timestamps: false
});

export default BorrowTransaction;
