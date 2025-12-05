import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BorrowRequest = sequelize.define('BorrowRequest', {
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
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  request_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewed_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejection_note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'borrow_requests',
  timestamps: false
});

export default BorrowRequest;
