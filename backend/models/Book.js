import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'authors',
      key: 'id'
    }
  },
  isbn: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  total_copies: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  available_copies: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'books',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Book;
