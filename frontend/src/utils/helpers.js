export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateFine = (dueDate) => {
  const due = new Date(dueDate);
  const now = new Date();
  
  if (now <= due) return 0;
  
  const daysLate = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
  return daysLate * 0.50;
};

export const isOverdue = (dueDate) => {
  return new Date() > new Date(dueDate);
};
