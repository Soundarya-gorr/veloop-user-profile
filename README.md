# VELoop User Profile Management System

## Project Overview

A full-stack User Profile Management System developed as part of the VELoop internship Task 14. The application aims to provide users with a dashboard to manage their profiles and rewards, along with an administrative interface for managing users and related activities.

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Lucide React
- Recharts

### Backend
- Python
- Flask
- Flask-SQLAlchemy
- PyMySQL
- Werkzeug

### Database
- MySQL

## Project Structure

```text
veloop-user-profile/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── screenshots/
├── .gitignore
└── README.md
```

## Current Features

### Frontend
- Initial React dashboard UI
- Sidebar navigation and dashboard layout
- Dashboard styling and visual components

### Backend
- Flask API setup
- MySQL database connection
- User registration
- Password hashing
- User login and password verification
- User profile retrieval

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend status |
| GET | `/test-db` | Test database connection |
| POST | `/register` | Register a user |
| POST | `/login` | Login a user |
| GET | `/profile/<user_id>` | Retrieve user profile |

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Soundarya-gorr/veloop-user-profile.git
cd veloop-user-profile
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment in PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your local MySQL database connection, then start the backend:

```bash
python app.py
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Project Status

The initial React frontend dashboard and the initial Flask backend APIs with MySQL integration have been developed.

The project is currently under development. Remaining work includes:

- Completing the frontend dashboard and remaining pages
- Frontend and backend API integration
- Protected authentication and authorization
- Rewards management (Gems, Tokens, XP and levels)
- Admin panel and user management
- Testing and validation
- Documentation and deployment

## Developer

Soundarya
