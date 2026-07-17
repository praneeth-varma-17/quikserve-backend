<div align="center">

# ⚡ QUIKSERVE
### On-Demand Home Services Platform

**A full-stack Rapido-style service booking platform connecting customers with verified local technicians**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-quik--serve.netlify.app-FF7A00?style=for-the-badge&logo=netlify)](https://quik-serve.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-8B5CF6?style=for-the-badge&logo=railway)](https://quikserve-backend-production.up.railway.app)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)

![QUIKSERVE Banner](https://via.placeholder.com/1200x400/050816/FF7A00?text=QUIKSERVE+%E2%80%94+On+Demand+Home+Services)

</div>

---

## 🚀 Live Demo

| Role | URL | Credentials |
|------|-----|-------------|
| Customer | [quik-serve.netlify.app](https://quik-serve.netlify.app) | customer@demo.com / demo123 |
| Technician | [quik-serve.netlify.app](https://quik-serve.netlify.app) | technician@demo.com / demo123 |

---

## 📌 What is QUIKSERVE?

QUIKSERVE is a full-stack on-demand home services platform — think **Rapido/Uber for home repair technicians**.

Customers can book verified electricians, plumbers, carpenters and more. The request is instantly dispatched to all nearby available technicians — the first one to accept gets the job. Customers can then track their technician live on a map.

---

## ✨ Features

### Customer Side
- 🔍 **Service Selection** — Choose from Electrician, Plumber, Carpenter, AC Repair, Painter, Cleaning
- 🔧 **Problem Selection** — Predefined problem categories per service type
- 💰 **Dynamic Pricing** — Real-time price estimate before booking (base + distance + urgency + night charge)
- 📡 **Live Dispatch** — Request sent simultaneously to all nearby available technicians
- 📍 **Live GPS Tracking** — Track technician location in real time on a map with ETA
- ⭐ **Rating System** — Rate and review technician after job completion
- 📋 **Booking History** — Full service receipt history with charts and analytics

### Technician Side
- 🔔 **Incoming Requests** — Real-time incoming job notifications with customer details and payout
- ✅ **Accept / Decline** — First technician to accept wins the job
- 🗺️ **Navigate to Customer** — Built-in map with route + Google Maps navigation button
- 📊 **Dashboard** — Earnings tracker, rating display, completed jobs history
- 🟢 **Availability Toggle** — Go online/offline with one click

### Platform
- 🔐 **JWT Authentication** — Secure login with role-based access (customer/technician)
- 🌍 **Location-based Matching** — 20km radius technician filtering using GPS coordinates
- 💵 **Smart Pricing Algorithm** — Base price + distance charge + urgency fee + night surcharge
- 📈 **Live Stats** — Real booking counts, ratings and technician data from database

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| HTML5, CSS3, JavaScript | Core frontend |
| Plus Jakarta Sans (Google Fonts) | Typography |
| Leaflet.js | Interactive maps and GPS tracking |
| OpenStreetMap | Free map tiles |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| geolib | Distance calculation |
| dotenv | Environment variables |
| cors | Cross-origin requests |

### Deployment
| Service | Purpose |
|---------|---------|
| Railway | Backend hosting |
| Netlify | Frontend hosting |
| MongoDB Atlas | Database hosting |
| GitHub | Version control |

---

## 🏗️ System Architecture

---

## 💰 Pricing Algorithm

```javascript
Total Price = Base Price
            + Distance Charge (Rs.15 per km)
            + Urgency Fee     (Rs.50 if urgent)
            + Night Surcharge (Rs.80 if 9PM–6AM)

Base Prices:
  Electrician → Rs.200
  Plumber     → Rs.180
  Carpenter   → Rs.220
  AC Repair   → Rs.350
  Painter     → Rs.150
  Cleaning    → Rs.120
```

---

## 📁 Project Structure
---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/quikserve-backend.git
cd quikserve-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET

# Start the server
npm start
```

### Environment Variables

Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend Setup

```bash
# Clone frontend repository
git clone https://github.com/YOUR_USERNAME/quikserve-frontend.git
cd quikserve-frontend

# Open index.html in browser
# Or use Live Server extension in VS Code
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register customer or technician | No |
| POST | `/api/auth/login` | Login and get JWT token | No |
| GET | `/api/auth/me` | Get current user profile | JWT |
| PATCH | `/api/auth/availability` | Toggle technician availability | JWT |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create booking request | JWT |
| GET | `/api/bookings/mine` | Get my bookings | JWT |
| GET | `/api/bookings/accepted` | Get accepted jobs (technician) | JWT |
| GET | `/api/bookings/history` | Get completed bookings | JWT |
| PATCH | `/api/bookings/:id/accept` | Accept a booking | JWT |
| PATCH | `/api/bookings/:id/reject` | Reject a booking | JWT |
| PATCH | `/api/bookings/:id/complete` | Mark job as complete | JWT |
| PATCH | `/api/bookings/:id/rate` | Rate a technician | JWT |
| POST | `/api/bookings/location` | Update technician location | JWT |

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name:         String,
  email:        String (unique),
  password:     String (hashed),
  phone:        String,
  city:         String,
  role:         'customer' | 'technician',
  serviceType:  String,
  experience:   Number,
  isAvailable:  Boolean,
  avgRating:    Number,
  totalRatings: Number,
  lat:          Number,
  lng:          Number
}
```

### Booking Model
```javascript
{
  customer:            ObjectId → User,
  technician:          ObjectId → User,
  notifiedTechnicians: [ObjectId],
  serviceType:         String,
  description:         String,
  problem:             String,
  address:             String,
  customerLat:         Number,
  customerLng:         Number,
  isUrgent:            Boolean,
  price:               Number,
  priceBreakdown:      Object,
  status:              'pending' | 'accepted' | 'rejected' | 'completed',
  rating:              Number,
  review:              String
}
```

---

## 🎯 Key Technical Decisions

**Why polling instead of WebSockets?**
Polling every 4-5 seconds was chosen for simplicity and reliability. WebSockets would be the next upgrade for true real-time updates.

**Why OpenStreetMap instead of Google Maps?**
OpenStreetMap is completely free with no API key required, making it ideal for an MVP. Google Maps would require billing setup.

**Why JWT in localStorage?**
Simple implementation for MVP. Production would use httpOnly cookies for better security.

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Landing Page | Professional dark theme with trust signals |
| Login | Split layout with service info cards |
| Booking | Two-panel booking with live map |
| Dashboard | Action-first technician workspace |
| Tracking | Live GPS tracking with ETA |
| History | Service receipts with monthly charts |

---

## 🔮 Future Improvements

- [ ] Push notifications (Firebase FCM)
- [ ] OTP login via SMS (Twilio)
- [ ] Payment gateway (Razorpay)
- [ ] Admin panel
- [ ] React Native mobile app
- [ ] WebSocket real-time updates
- [ ] Rate limiting and input validation

---

## 👨‍💻 Author

**Praneeth Varma**

[![GitHub](https://img.shields.io/badge/GitHub-praneeth--varma--17-181717?style=flat&logo=github)](https://github.com/praneeth-varma-17)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by Praneeth Varma**

⭐ Star this repo if you found it helpful!

</div>

