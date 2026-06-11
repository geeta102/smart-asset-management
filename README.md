# Smart Asset Management and Resource Allocation Platform

A full-stack web application for managing shared organizational assets with booking, approval workflows, and analytics.

## Tech Stack

- **Frontend:** React.js, Recharts, Axios, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)

## Features

### Mandatory Features
- ✅ User Authentication (Register/Login with JWT)
- ✅ Role-Based Access Control (Admin / User)
- ✅ Inventory Management (Add, Edit, Delete, Categorize Assets)
- ✅ Asset Discovery and Booking (Search, Filter, Book with date range)
- ✅ Approval Workflow (Admin can Approve/Reject booking requests)
- ✅ Asset Issue and Return Management
- ✅ Analytics Dashboard (Bar Chart, Pie Chart, Summary Cards)
- ✅ Borrowing History (Users can track their bookings)

### Bonus Features
- ✅ Audit Logs (Every action is logged in database)

## Project Structure
smart-asset-management/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # JWT authentication
│   │   ├── routes/            # API endpoints
│   │   └── index.js           # Server entry point
│   └── .env                   # Environment variables
└── frontend/
└── src/
├── pages/             # React pages
├── components/        # Reusable components
├── context/           # Auth context
└── api.js             # API calls

## Database Schema

- **User** - Stores user info with role (ADMIN/USER)
- **Asset** - Asset inventory with quantity tracking
- **Booking** - Booking requests with status workflow
- **AuditLog** - System activity tracking

## Setup Instructions

### Prerequisites
- Node.js v16+
- PostgreSQL

### Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/assets | Get all assets |
| POST | /api/assets | Create asset (Admin) |
| DELETE | /api/assets/:id | Delete asset (Admin) |
| POST | /api/bookings | Create booking request |
| GET | /api/bookings | Get all bookings (Admin) |
| GET | /api/bookings/my | Get my bookings |
| PUT | /api/bookings/:id/status | Approve/Reject (Admin) |
| PUT | /api/bookings/:id/return | Return asset |

## Running the Application

1. Start Backend: `cd backend && npm run dev` (runs on port 8000)
2. Start Frontend: `cd frontend && npm start` (runs on port 3000)
3. Open browser: `http://localhost:3000`

## Test Credentials

- **Admin:** admin@test.com / admin123
- **User:** user@test.com / user123