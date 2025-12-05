export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('borrow_transactions', {
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
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      issued_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      issue_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fine_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('borrowed', 'returned', 'overdue'),
        defaultValue: 'borrowed',
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });

    await queryInterface.addIndex('borrow_transactions', ['user_id']);
    await queryInterface.addIndex('borrow_transactions', ['book_id']);
    await queryInterface.addIndex('borrow_transactions', ['status']);
    await queryInterface.addIndex('borrow_transactions', ['due_date']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('borrow_transactions');
}
