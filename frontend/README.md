# Library Management System - Frontend

Modern, responsive React frontend for the Library Management System.

## Features

- 🔐 JWT Authentication (Access + Refresh Tokens)
- 📚 Books Management (CRUD)
- 👥 Members Management (CRUD)
- 📖 Issue/Return Books
- ⏰ Overdue Tracking with Fines
- 📊 Dashboard with Statistics
- 🔍 Search & Filter
- 📱 Fully Responsive
- 🎨 Clean UI with Tailwind CSS

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast
- Lucide React (Icons)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Default Credentials

**Librarian:**
- Email: `admin@library.com`
- Password: `password123`

**Member:**
- Email: `john@example.com`
- Password: `password123`

## Pages

- `/login` - Librarian login
- `/dashboard` - Dashboard with stats
- `/books` - Books management
- `/members` - Members management
- `/borrow` - Issue books
- `/return` - Return books
- `/overdue` - Overdue books report
- `/member` - Public member self-service (no login)

## API Configuration

Backend API URL is configured in `src/services/api.js`:
```javascript
baseURL: 'http://localhost:3000/api'
```

Change this if your backend runs on a different port.
