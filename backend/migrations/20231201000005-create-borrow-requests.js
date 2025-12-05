export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('borrow_requests', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    book_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    status: {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    request_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    reviewed_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewed_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    rejection_note: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });

  await queryInterface.addIndex('borrow_requests', ['user_id']);
  await queryInterface.addIndex('borrow_requests', ['book_id']);
  await queryInterface.addIndex('borrow_requests', ['status']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('borrow_requests');
}
