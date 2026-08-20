# HomelyHub — Project Submission Report 🏡

**Project Title:** HomelyHub – Modern Full-Stack Property Booking Platform  
**Architecture:** MERN Stack (MongoDB, Express.js, React.js, Node.js)  
**Duration:** 4-Week Internship Project  

---

## 1. Executive Summary

**HomelyHub** is an intuitive, full-stack vacation rental and property booking web application designed to connect travelers with unique homes and villas. The application provides a seamless experience for browsing listings, filtering by city and budget, viewing real-time availability, and making instant reservations with rigorous date-overlap prevention.

---

## 2. Technology Stack

### Frontend (`/client`)
- **Library/Framework:** React 18+ powered by **Vite**
- **Routing:** `react-router-dom` v6
- **HTTP Client:** `axios` (with Bearer Token request interceptors)
- **Icons:** `lucide-react`
- **Styling:** Custom CSS Design System with responsive grid layouts, glassmorphism headers, and fluid typography (`Plus Jakarta Sans`).

### Backend (`/server`)
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database ODM:** Mongoose / MongoDB
- **Security & Auth:** JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS configuration
- **Environment Management:** `dotenv`

---

## 3. Key Features & Implementation Highlights

### 🔐 Authentication & Role-Based Access
- Secure password hashing using Bcrypt (10 salt rounds).
- Stateless JWT-based authentication stored in `localStorage` and managed globally via `AuthContext`.
- Role-based separation:
  - **Guest / Traveler:** Explore stays, calculate pricing, reserve dates, view/cancel reservations.
  - **Property Host / Owner:** Create, manage, update, and delete property listings.
- Route protection using `<ProtectedRoute>` component.

### 🔍 Explore & Multi-Criteria Filter Engine
- Dynamic filtering by **City / Location** (regex case-insensitive).
- **Price range** filtering (`minPrice` and `maxPrice`).
- **Full-text search** matching titles and descriptions.
- Instant filter reset and responsive property cards.

### 📅 Smart Booking Engine & Overlap Prevention
- Dynamic night and total cost calculator on the client.
- **Mathematical Overlap Condition:**
  $$\text{existingCheckIn} < \text{newCheckOut} \quad \text{AND} \quad \text{existingCheckOut} > \text{newCheckIn}$$
- Instant validation rejecting past dates and conflicting reservations.
- User bookings dashboard with status pills (`CONFIRMED`, `PENDING`, `CANCELLED`).

---

## 4. Project Folder Structure

```
HomelyHub/
│
├── client/                             # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js                # Axios instance + JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Responsive header with auth menu
│   │   │   ├── Footer.jsx              # Global footer
│   │   │   ├── PropertyCard.jsx        # Listing card component
│   │   │   └── ProtectedRoute.jsx      # Route guard for auth pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # React Context for global auth
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Landing page & search
│   │   │   ├── Listings.jsx            # Filterable catalog
│   │   │   ├── PropertyDetail.jsx      # Property details & booking widget
│   │   │   ├── Login.jsx               # User sign-in
│   │   │   ├── Signup.jsx              # User registration
│   │   │   └── MyBookings.jsx          # Trips dashboard & cancellation
│   │   ├── App.jsx                     # Route definitions
│   │   ├── index.css                   # Global design system
│   │   └── main.jsx                    # Application root
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                             # Express REST API (Node.js)
│   ├── config/
│   │   └── db.js                       # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js           # Register, login, me
│   │   ├── propertyController.js       # Property CRUD & search
│   │   └── bookingController.js        # Booking logic & overlap verification
│   ├── middleware/
│   │   └── authMiddleware.js           # JWT verification & role authorization
│   ├── models/
│   │   ├── User.js                     # User schema
│   │   ├── Property.js                 # Property schema
│   │   └── Booking.js                  # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth
│   │   ├── propertyRoutes.js           # /api/properties
│   │   └── bookingRoutes.js            # /api/bookings
│   ├── seed.js                         # Database mock seeder
│   ├── .env.example
│   ├── index.js                        # Server entry point
│   └── package.json
│
├── .gitignore
├── PROJECT_REPORT.md
└── README.md
```

---

## 5. REST API Endpoints Specification

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new guest or host |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |
| `GET` | `/api/properties` | Public | Get all properties (supports `location`, `search`, `minPrice`, `maxPrice`) |
| `GET` | `/api/properties/:id` | Public | Get single property with populated owner |
| `POST` | `/api/properties` | Private (Owner) | Create a new property listing |
| `PUT` | `/api/properties/:id` | Private (Owner) | Update an owned property |
| `DELETE`| `/api/properties/:id` | Private (Owner) | Delete an owned property |
| `POST` | `/api/bookings` | Private | Reserve dates with overlap prevention |
| `GET` | `/api/bookings/my` | Private | Retrieve user reservation history |
| `PATCH`| `/api/bookings/:id/cancel` | Private | Cancel user reservation |
| `GET` | `/api/health` | Public | Backend health & status check |

---

## 6. Deployment & Environment Setup

### Database
- **MongoDB Atlas:** Create a free cluster, whitelist IP `0.0.0.0/0`, and copy connection URI into `MONGO_URI`.

### Backend Deployment (Render / Railway)
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `PORT=5000`
  - `MONGO_URI=<mongodb_atlas_connection_string>`
  - `JWT_SECRET=<secure_random_key>`
  - `CLIENT_URL=<deployed_frontend_url>`

### Frontend Deployment (Vercel / Netlify)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL=<deployed_backend_url>/api`

---

## 7. UI Screenshots & Wireframe References

```
[ Screenshot Placeholder: Home Hero Section & Search ]
[ Screenshot Placeholder: Listings Catalog with Filters ]
[ Screenshot Placeholder: Property Details & Dynamic Booking Widget ]
[ Screenshot Placeholder: My Bookings Dashboard with Status Badges ]
[ Screenshot Placeholder: Sign In & Registration Modals ]
```

---

## 8. Conclusion

HomelyHub demonstrates full proficiency across the entire MERN stack, delivering robust architectural separation between frontend and backend, comprehensive security practices, responsive design aesthetics, and real-world business logic.
