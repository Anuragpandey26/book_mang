export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'authors',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      isbn: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      publisher: {
        type: Sequelize.STRING,
        allowNull: true
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_copies: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      available_copies: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      cover_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('books', ['title']);
    await queryInterface.addIndex('books', ['author_id']);
    await queryInterface.addIndex('books', ['isbn']);
    await queryInterface.addIndex('books', ['category']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('books');
}
