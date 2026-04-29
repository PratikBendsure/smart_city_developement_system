<<<<<<< HEAD
<p align="center">
  <h1 align="center">🏙️ CivicFix — Smart City Complaint Management System</h1>
  <p align="center">
    A full-stack web application for citizens to report, track, and resolve civic issues with AI-powered analysis.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Gemini-4285F4?logo=google&logoColor=white" />
</p>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Frontend Pages](#-frontend-pages)
- [Default Credentials](#-default-credentials)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏗️ About the Project

**CivicFix** is a Smart City Complaint Management System that empowers citizens to report civic issues (potholes, water supply problems, waste management, etc.) and track their resolution in real-time. The platform integrates **Google Gemini AI** to automatically analyze uploaded images, classify complaint categories, and assess severity — enabling municipal officers to prioritize and respond faster.

The system supports **multi-language** interfaces (English, Hindi, Marathi, Kannada, Tamil), **role-based access control** (citizen, admin, municipal), and provides rich **analytics dashboards** for administrators.

---

## ✨ Features

### 🧑‍💼 For Citizens
- **Report Issues** — Submit complaints with image upload, location, and category selection
- **AI-Powered Analysis** — Automatic image analysis via Google Gemini for category, severity, and description
- **Track Complaints** — Real-time status tracking with unique tracking IDs (`CF-XXXXXX`)
- **Upvote Issues** — Support community-reported complaints to increase priority
- **Personal Dashboard** — View all submitted reports, status updates, and resolution history
- **Anonymous Reporting** — Report issues without creating an account

### 🏛️ For Administrators / Municipal Officers
- **Admin Panel** — Manage all complaints, update statuses, assign departments
- **Statistics Dashboard** — Interactive charts and analytics (powered by Recharts)
- **Activity Logs** — Track all user and system actions
- **Complaint Resolution** — Add comments, update status, upload before/after images
- **User Management** — View and manage registered users

### 🤖 AI Integration
- **Image Analysis** — Gemini AI analyzes uploaded photos to identify civic issues
- **Auto-Categorization** — AI suggests categories and severity levels
- **Smart Descriptions** — AI generates descriptive titles and summaries

### 🌐 Platform Features
- **Multi-Language Support** — English, Hindi, Marathi, Kannada, Tamil (via i18next)
- **Responsive Design** — Mobile-first, works on all devices
- **Smooth Animations** — Framer Motion powered UI transitions
- **Rate Limiting** — API protection against abuse
- **Security** — Helmet, bcrypt password hashing, JWT authentication
- **RTI Information** — Right to Information page for transparency
- **Privacy Policy & Terms** — Legal compliance pages

---

## 🛠️ Tech Stack

### Frontend
| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| React 19          | UI library                       |
| Vite 7            | Build tool & dev server          |
| React Router v7   | Client-side routing              |
| Axios             | HTTP client                      |
| Framer Motion     | Animations & transitions         |
| Recharts          | Charts & data visualization      |
| React Icons       | Icon library                     |
| React Hot Toast   | Toast notifications              |
| React Dropzone    | Drag & drop file uploads         |
| i18next           | Internationalization (i18n)      |

### Backend
| Technology           | Purpose                       |
| -------------------- | ----------------------------- |
| Node.js + Express    | REST API server               |
| MongoDB + Mongoose   | Database & ODM                |
| JSON Web Tokens      | Authentication                |
| bcryptjs             | Password hashing              |
| Multer               | File upload handling          |
| Helmet               | HTTP security headers         |
| Morgan               | HTTP request logging          |
| express-rate-limit   | Rate limiting                 |
| Google Generative AI | Gemini AI integration         |
| uuid                 | Unique ID generation          |

---

## 📁 Project Structure

```
smart-city-development-system/
├── backend/
│   ├── data/                  # Static/reference data
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── upload.js          # Multer file upload config
│   ├── models/
│   │   ├── User.js            # User schema (citizen, admin, municipal)
│   │   ├── Complaint.js       # Complaint schema with AI analysis
│   │   └── ActivityLog.js     # Activity tracking schema
│   ├── routes/
│   │   ├── auth.js            # Register, login, profile
│   │   ├── complaints.js      # CRUD for complaints
│   │   ├── admin.js           # Admin management endpoints
│   │   ├── ai.js              # AI analysis endpoints
│   │   └── activity.js        # Activity log endpoints
│   ├── services/
│   │   └── geminiAI.js        # Google Gemini AI service
│   ├── utils/
│   │   ├── seed.js            # Auto-seed admin account
│   │   ├── seedData.js        # Demo data seeder
│   │   └── logActivity.js     # Activity logging utility
│   ├── uploads/               # Uploaded complaint images
│   ├── server.js              # Express app entry point
│   ├── .env.example           # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── public/                # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   ├── Navbar.css     # Navbar styles
│   │   │   └── Footer.jsx     # Footer component
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context provider
│   │   ├── i18n/              # i18next translation configs
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── Login.jsx      # User login
│   │   │   ├── Register.jsx   # User registration
│   │   │   ├── ReportIssue.jsx# Submit new complaint
│   │   │   ├── TrackReport.jsx# Track complaint status
│   │   │   ├── Dashboard.jsx  # User dashboard
│   │   │   ├── AdminPanel.jsx # Admin management panel
│   │   │   ├── Statistics.jsx # Analytics & charts
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── TermsOfUse.jsx
│   │   │   └── RTI.jsx        # Right to Information
│   │   ├── services/
│   │   │   └── api.js         # Axios API configuration
│   │   ├── App.jsx            # Root component with routing
│   │   ├── App.css
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # App entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas cloud)
- **npm** (comes with Node.js)
- **Google Gemini API Key** (for AI features)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-city-development-system.git
cd smart-city-development-system
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# Start the backend server
npm run dev
```

The backend will start on **http://localhost:5000**.

> **Note:** On first startup, the server automatically seeds an admin account if the database is empty.

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:5173**.

### 4. Build for Production

```bash
# Frontend production build
cd frontend
npm run build

# The build output will be in frontend/dist/
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civicfix
JWT_SECRET=civicfix_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

| Variable       | Description                                    | Required |
| -------------- | ---------------------------------------------- | -------- |
| `PORT`         | Backend server port (default: 5000)            | No       |
| `MONGODB_URI`  | MongoDB connection string                      | Yes      |
| `JWT_SECRET`   | Secret key for JWT token signing               | Yes      |
| `JWT_EXPIRE`   | JWT token expiration duration (default: 7d)    | No       |
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis        | Yes      |
| `NODE_ENV`     | Environment mode (`development`/`production`)  | No       |

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint              | Description              | Auth |
| ------ | --------------------- | ------------------------ | ---- |
| POST   | `/api/auth/register`  | Register a new user      | No   |
| POST   | `/api/auth/login`     | Login & get JWT token    | No   |
| GET    | `/api/auth/profile`   | Get current user profile | Yes  |
| PUT    | `/api/auth/profile`   | Update user profile      | Yes  |

### Complaints (`/api/complaints`)
| Method | Endpoint                         | Description                    | Auth     |
| ------ | -------------------------------- | ------------------------------ | -------- |
| POST   | `/api/complaints`                | Create a new complaint         | Optional |
| GET    | `/api/complaints`                | Get all complaints             | No       |
| GET    | `/api/complaints/:id`            | Get complaint by ID            | No       |
| GET    | `/api/complaints/track/:trackId` | Track by tracking ID           | No       |
| PUT    | `/api/complaints/:id`            | Update complaint               | Yes      |
| PUT    | `/api/complaints/:id/upvote`     | Upvote a complaint             | Yes      |

### Admin (`/api/admin`)
| Method | Endpoint                  | Description                 | Auth  |
| ------ | ------------------------- | --------------------------- | ----- |
| GET    | `/api/admin/stats`        | Get dashboard statistics    | Admin |
| GET    | `/api/admin/users`        | List all users              | Admin |
| PUT    | `/api/admin/complaints/:id` | Update complaint status   | Admin |

### AI (`/api/ai`)
| Method | Endpoint            | Description                  | Auth |
| ------ | ------------------- | ---------------------------- | ---- |
| POST   | `/api/ai/analyze`   | Analyze image with Gemini AI | No   |

### Activity (`/api/activity`)
| Method | Endpoint            | Description                 | Auth  |
| ------ | ------------------- | --------------------------- | ----- |
| GET    | `/api/activity`     | Get recent activity logs    | Admin |

### Health Check
| Method | Endpoint       | Description        | Auth |
| ------ | -------------- | ------------------ | ---- |
| GET    | `/api/health`  | API status check   | No   |

---

## 🗃️ Database Models

### User
| Field           | Type     | Description                              |
| --------------- | -------- | ---------------------------------------- |
| name            | String   | Full name (required, max 50 chars)       |
| email           | String   | Unique, lowercase email                  |
| phone           | String   | Indian mobile number (10 digits)         |
| password        | String   | Hashed with bcrypt (min 6 chars)         |
| role            | Enum     | `citizen`, `admin`, `municipal`          |
| language        | Enum     | `en`, `hi`, `mr`, `kn`, `ta`            |
| ward            | String   | Ward identifier                          |
| city            | String   | City name (default: Mumbai)              |
| isActive        | Boolean  | Account status                           |
| profilePic      | String   | Profile image URL                        |
| totalReports    | Number   | Total complaints submitted               |
| resolvedReports | Number   | Total resolved complaints                |

### Complaint
| Field                | Type     | Description                                  |
| -------------------- | -------- | -------------------------------------------- |
| trackingId           | String   | Unique ID (format: `CF-XXXXXX`)              |
| userId               | ObjectId | Reference to User (optional for anonymous)   |
| category             | Enum     | Issue category (9 categories)                |
| title                | String   | Complaint title (max 200 chars)              |
| description          | String   | Detailed description (max 1000 chars)        |
| location             | Object   | Address, ward, city, coordinates             |
| imageUrl             | String   | Uploaded image path                          |
| aiAnalysis           | Object   | Gemini AI analysis results                   |
| status               | Enum     | `pending`, `in_progress`, `resolved`, `rejected`, `escalated` |
| priority             | Enum     | `low`, `medium`, `high`, `urgent`            |
| severity             | Enum     | `low`, `medium`, `high`, `critical`          |
| upvotes / upvotedBy  | Number / Array | Community upvote tracking             |
| comments             | Array    | Officer comments with timestamps             |
| statusHistory        | Array    | Status change audit trail                    |
| targetResolutionAt   | Date     | 24-hour resolution target                    |

#### Complaint Categories
| Category             | Description             |
| -------------------- | ----------------------- |
| `water_supply`       | Water supply issues     |
| `waste_management`   | Garbage & waste         |
| `road_infrastructure`| Roads & potholes        |
| `health_services`    | Public health           |
| `education_facility` | Schools & education     |
| `parks_recreation`   | Parks & public spaces   |
| `fire_emergency`     | Fire safety             |
| `sanitation_hygiene` | Sanitation & hygiene    |
| `encroachment`       | Illegal encroachment    |

### ActivityLog
Tracks all system activities for audit purposes — user logins, complaint submissions, status updates, etc.

---

## 🖥️ Frontend Pages

| Route          | Component         | Description                               | Access    |
| -------------- | ----------------- | ----------------------------------------- | --------- |
| `/`            | Home              | Landing page with hero, features, stats   | Public    |
| `/login`       | Login             | User authentication                       | Public    |
| `/register`    | Register          | New user registration                     | Public    |
| `/report`      | ReportIssue       | Submit complaint with image & AI analysis | Public    |
| `/track`       | TrackReport       | Search & track complaints                 | Public    |
| `/track/:id`   | TrackReport       | Direct tracking by ID                     | Public    |
| `/stats`       | Statistics        | Public analytics dashboard                | Public    |
| `/privacy`     | PrivacyPolicy     | Privacy policy page                       | Public    |
| `/terms`       | TermsOfUse        | Terms of use page                         | Public    |
| `/rti`         | RTI               | Right to Information page                 | Public    |
| `/dashboard`   | Dashboard         | User's personal dashboard                 | Protected |
| `/admin`       | AdminPanel        | Admin management panel                    | Admin     |

---

## 🔑 Default Credentials

On first startup, the system auto-seeds the following admin account:

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@civicfix.com`   |
| Password | `admin123`             |
| Role     | `admin`                |

> ⚠️ **Important:** Change the default admin password immediately in production!

---

## 📸 Screenshots

> _Screenshots can be added here to showcase the application UI._

<!-- 
Add screenshots like:
![Home Page](./screenshots/home.png)
![Report Issue](./screenshots/report.png)
![Admin Panel](./screenshots/admin.png)
-->

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for Smart Cities
</p>
=======
# smart_city_developement_system
>>>>>>> 488722d63d7edacf2c575892fefa3c30a522a394
