export async function up(queryInterface, Sequelize) {
  
  const now = new Date();
  

  const fifteenDaysAgo = new Date(now);
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  
  const twentyDaysAgo = new Date(now);
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
  
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  

  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const sixDaysAgo = new Date(now);
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  
  const sixteenDaysAgo = new Date(now);
  sixteenDaysAgo.setDate(sixteenDaysAgo.getDate() - 16);

  await queryInterface.bulkInsert('borrow_transactions', [
    {
      book_id: 2, 
      user_id: 2, 
      issued_by: 1, 
      issue_date: fifteenDaysAgo,
      due_date: oneDayAgo,
      return_date: null,
      fine_amount: 0.00,
      status: 'borrowed'
    },
    {
      book_id: 3, 
      user_id: 3,
      issued_by: 1, 
      issue_date: twentyDaysAgo,
      due_date: sixDaysAgo, 
      return_date: null,
      fine_amount: 0.00,
      status: 'borrowed'
    },
    {
      book_id: 4, 
      user_id: 2, 
      issued_by: 1,
      issue_date: thirtyDaysAgo,
      due_date: sixteenDaysAgo, 
      return_date: null,
      fine_amount: 0.00,
      status: 'borrowed'
    }
  ], {});

  
  await queryInterface.sequelize.query(`
    UPDATE books SET available_copies = available_copies - 1 WHERE id IN (2, 3, 4);
  `);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('borrow_transactions', {
    book_id: [2, 3, 4]
  }, {});


  await queryInterface.sequelize.query(`
    UPDATE books SET available_copies = total_copies WHERE id IN (2, 3, 4);
  `);
}
