import bcrypt from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin Librarian',
        email: 'admin@library.com',
        phone: '1234567890',
        address: '123 Library St',
        role: 'librarian',
        password: hashedPassword,
        created_at: new Date()
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        address: '456 Member Ave',
        role: 'member',
        password: hashedPassword,
        created_at: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '5551234567',
        address: '789 Reader Rd',
        role: 'member',
        password: hashedPassword,
        created_at: new Date()
      }
    ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('users', null, {});
}
