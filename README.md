# 📚 Library Management System

A modern, full-stack library management system built with React, Node.js, Express, and PostgreSQL. This system provides comprehensive functionality for managing books, members, and borrowing operations in a library setting.

## ✨ Features

### 👨‍💼 Admin Features
- **Dashboard**: Overview of library statistics and recent activities
- **Book Management**: Add, edit, delete, and search books with author management
- **Member Management**: Add and manage library members (password-free admin creation)
- **Borrow Requests**: Approve or reject member borrow requests
- **Issue Books**: Direct book issuance to members
- **Return Management**: Process book returns and track overdue items
- **Overdue Tracking**: Monitor and manage overdue books

### 👤 Member Features
- **Self Registration**: Members can register with their own password
- **Book Browsing**: Search and browse available books
- **Borrow Requests**: Request books for borrowing
- **My Requests**: Track borrow request status
- **Profile Management**: Update personal information and password
- **Member Dashboard**: View borrowed books and account status

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Admin/Member)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

## 🛠️ Tech Stack

### Frontend
- React- Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize ORM** - Database management
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Database Configuration

Create a PostgreSQL database and update your `.env` file:

```env
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=
PORT=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_EXPIRY=
```

### 4. Database Migration & Seeding

```bash
# Run migrations
npx sequelize-cli db:migrate

# Seed the database (optional)
npx sequelize-cli db:seed:all
```

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## 🏃‍♂️ Running the Application

### Development Mode

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```
Application will open on `http://localhost:5173`

### Production Build

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
library-management-system/
├── backend/
│   ├── config/
│   │   ├── config.cjs
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── borrowController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── migrations/
│   ├── models/
│   │   ├── Author.js
│   │   ├── Book.js
│   │   ├── BorrowRequest.js
│   │   ├── BorrowTransaction.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/
│   ├── seeders/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Navbar.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Books.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Members.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## 🔑 Default Login Credentials

After seeding the database, you can use these credentials:

**Admin Account:**
- Email: `admin@library.com`
- Password: `password123`

**Test Member Account:**
- Email: `test@gmail.com`
- Password: `test123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Member registration
- `POST /api/auth/refresh` - Refresh JWT token

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book (Admin)
- `PUT /api/books/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Users/Members
- `GET /api/users` - Get all users (Admin)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Borrow Management
- `GET /api/borrow-requests` - Get borrow requests
- `POST /api/borrow-requests` - Create borrow request
- `PUT /api/borrow-requests/:id` - Update request status
- `GET /api/borrow-transactions` - Get borrow history

## 🎨 Key Features Explained

### Smart Author Management
- When adding books, simply type the author name
- System automatically creates new authors or uses existing ones
- No need to manage authors separately

### Flexible Copy Management
- Set total copies when adding books
- Adjust available copies independently when editing
- Automatic tracking of borrowed vs available copies

### Secure Member Creation
- Admins create members without handling passwords
- Members set their own passwords during registration or profile update
- Temporary passwords generated for admin-created accounts

### Real-time Notifications
- Toast notifications for all user actions
- Success/error feedback for better UX
- Form validation with helpful messages
