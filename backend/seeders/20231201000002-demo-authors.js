export async function up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('authors', [
      {
        name: 'J.K. Rowling',
        bio: 'British author, best known for the Harry Potter series',
        created_at: new Date()
      },
      {
        name: 'George Orwell',
        bio: 'English novelist and essayist, known for 1984 and Animal Farm',
        created_at: new Date()
      },
      {
        name: 'Jane Austen',
        bio: 'English novelist known for her romantic fiction',
        created_at: new Date()
      },
      {
        name: 'Mark Twain',
        bio: 'American writer and humorist',
        created_at: new Date()
      }
    ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('authors', null, {});
}
