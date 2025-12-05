export async function up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('books', [
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author_id: 1,
        isbn: '9780747532699',
        category: 'Fantasy',
        publisher: 'Bloomsbury',
        year: 1997,
        total_copies: 5,
        available_copies: 5,
        created_at: new Date()
      },
      {
        title: '1984',
        author_id: 2,
        isbn: '9780451524935',
        category: 'Dystopian',
        publisher: 'Secker & Warburg',
        year: 1949,
        total_copies: 3,
        available_copies: 3,
        created_at: new Date()
      },
      {
        title: 'Pride and Prejudice',
        author_id: 3,
        isbn: '9780141439518',
        category: 'Romance',
        publisher: 'T. Egerton',
        year: 1813,
        total_copies: 4,
        available_copies: 4,
        created_at: new Date()
      },
      {
        title: 'Animal Farm',
        author_id: 2,
        isbn: '9780451526342',
        category: 'Political Satire',
        publisher: 'Secker & Warburg',
        year: 1945,
        total_copies: 2,
        available_copies: 2,
        created_at: new Date()
      },
      {
        title: 'The Adventures of Tom Sawyer',
        author_id: 4,
        isbn: '9780486400778',
        category: 'Adventure',
        publisher: 'American Publishing Company',
        year: 1876,
        total_copies: 3,
        available_copies: 3,
        created_at: new Date()
      }
    ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('books', null, {});
}
