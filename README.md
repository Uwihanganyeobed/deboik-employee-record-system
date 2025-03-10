# Employee Management System

A modern web application for managing employees built with Next.js 15, TypeScript, MongoDB, and NextAuth.js.

## 🚀 Features

- **Authentication**
  - Secure login and registration
  - Protected routes and API endpoints
  - Session management with NextAuth.js

- **Employee Management**
  - Add new employees
  - Edit existing employee details
  - Delete employees
  - Role-based access (Admin/Staff)
  - Bulk role updates

- **User Interface**
  - Responsive design for all devices
  - Modern and clean UI with Tailwind CSS
  - Interactive data tables
  - Form validation
  - Loading states and error handling
  - Image slider on auth pages

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 15 (App Router)
  - TypeScript
  - Tailwind CSS
  - React Hook Form

- **Backend**
  - MongoDB (Database)
  - NextAuth.js (Authentication)
  - bcryptjs (Password hashing)

- **Development**
  - ESLint
  - Prettier
  - TypeScript

## 📦 Installation

1. Clone the repository: https://github.com/Uwihanganyeobed/deboik-employee-record-system
2. Install dependencies:
3. Set up environment variables:
Create a `.env` file in the root directory with:

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

4. Run the development server:
   
## 🏗️ Project Structure
├── app/
│ ├── api/ # API routes
│ ├── dashboard/ # Dashboard pages
│ ├── login/ # Login page
│ └── register/ # Registration page
├── components/ # Reusable components
├── lib/ # Utilities and database
├── models/ # MongoDB models
├── providers/ # Context providers
└── types/ # TypeScript types


## 🔐 Authentication Flow

1. **Registration**
   - User fills registration form
   - Password is hashed using bcrypt
   - User data is stored in MongoDB
   - Redirected to login

2. **Login**
   - User provides credentials
   - NextAuth validates credentials
   - Creates session
   - Redirects to dashboard

## 💾 Database Schema

### User Model
typescript
{
name: string;
email: string;
password: string;
createdAt: Date;
updatedAt: Date;
}

### Employee Model
typescript
{
firstName: string;
lastName: string;
email: string;
phone: string;
role: 'Admin' | 'Staff';
createdBy: ObjectId;
createdAt: Date;
updatedAt: Date;
}

## 🔒 API Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

## 🎨 UI Components

- **Modal** - Reusable modal component
- **Button** - Customizable button component
- **LoadingSpinner** - Loading indicator
- **ErrorMessage** - Error display component
- **EmployeeForm** - Form for employee creation/editing

## 📱 Responsive Design

- Mobile-first approach
- Horizontal scrolling tables for small screens
- Responsive navigation
- Adaptive layouts for all screen sizes

## 🚀 Deployment

The application is configured for deployment with:
- TypeScript and ESLint checks disabled for production
- Standalone output configuration
- Environment variable validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

Created_Developed and edited by Uwihanganye Obed.
