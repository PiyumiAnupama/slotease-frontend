# 📅 SlotEase - Appointment Booking Platform

A modern React application for multi-business appointment booking in Sri Lanka.

**[Live Demo](https://slotease-frontend.vercel.app)** | **[Backend API](https://slotease-backend-tdw3.onrender.com)** 

---

## Overview

SlotEase is a full-stack MERN appointment booking platform that helps Sri Lankan SMBs (salons, clinics, legal services, tutoring, mechanic shops) manage customer appointments efficiently while providing customers with 24/7 online booking convenience.

---

## Key Features

### For Customers
- 🔐 Secure registration and login with JWT authentication
- 🔍 Search and filter businesses by category
- 📅 Easy appointment booking with date/time selection
- 📋 View and manage personal appointments
- 📱 Mobile-responsive design 

### For Business Owners
- 🏪 Create and manage business profile
- 📝 Add and manage services
- 📊 View and confirm customer appointments
- 🕐 Set custom operating hours

---

## Tech Stack

**Frontend:**
- React 18 with React Router v6
- Axios for API calls
- Context API for state management
- CSS3 with responsive design

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- Bcryptjs for password hashing

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/PiyumiAnupama/slotease-frontend.git
cd slotease-frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env

# Start development server
npm start
```

Open http://localhost:3001 in your browser.

---

## Available Scripts

```bash
npm start      # Run development server
npm run build  # Build for production
npm test       # Run tests
```

---

## Environment Variables

### Development (`.env`)
```
REACT_APP_API_URL=http://localhost:3000/api
```

### Production (`.env.production`)
```
REACT_APP_API_URL=https://slotease-backend-tdw3.onrender.com/api
```

---

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── BottomNav.js    # Mobile navigation
│   └── Toast.js        # Notifications
├── context/            # Global state
│   └── AuthContext.js  # Auth management
├── pages/              # Page components
│   ├── Login.js
│   ├── Home.js
│   ├── BusinessDetail.js
│   ├── BookAppointment.js
│   ├── MyAppointments.js
│   ├── MyBusiness.js
│   └── ...
├── services/
│   └── api.js          # Axios configuration
└── App.js              # Main app component
```

---

## Key Components

| Component | Purpose |
|-----------|---------|
| AuthContext | Manages user login/logout and JWT tokens |
| BottomNav | Mobile-friendly navigation (home, appointments, business, profile) |
| BookAppointment | Appointment booking form with date/time selection |
| BusinessDetail | Shows business info, hours, and available services |
| MyAppointments | Lists customer's appointments with status tracking |
| MyBusiness | Business owner dashboard for managing appointments |

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/businesses` | GET | Get all businesses |
| `/businesses/:id` | GET | Get business details |
| `/services/business/:id` | GET | Get business services |
| `/appointments` | GET/POST | View/create appointments |
| `/appointments/:id/status` | PATCH | Update appointment status |

---

## Features Breakdown

### Authentication
- JWT-based login/registration
- Tokens stored in localStorage
- Automatic token refresh on 401 response
- Protected routes for authenticated users

### Search & Filter
- Real-time search by business name
- Filter by categories: Salon, Clinic, Legal, Tutoring, Mechanic
- Combined search and filter functionality

### Booking System
- Interactive date picker (today onwards)
- Time slots in 30-minute intervals
- Automatic conflict detection
- Price display in LKR (Sri Lankan Rupees)

### Responsive Design
- Mobile-first approach
- Bottom navigation for mobile/tablet
- Desktop layout with grid system
- Touch-friendly buttons and inputs

---

## Security Features

- 🔒 JWT tokens with 7-day expiry
- 🔐 Bcryptjs password hashing
- 🛡️ CORS configured for authorized origins
- 🚫 Input validation on all forms
- ✅ XSS protection through React

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to vercel.com and import the repository
3. Add environment variable: `REACT_APP_API_URL=<backend-url>`
4. Click Deploy


---

## Author

**Anupama Piyadigama**
- Email: anupamapiyadigama@gmail.com
- GitHub: [@PiyumiAnupama](https://github.com/PiyumiAnupama)
---

## Related Projects

- **Backend Repository**: [slotease-backend](https://github.com/PiyumiAnupama/slotease-backend)

---

**⭐ If this project helped you, please give it a star on GitHub!**
