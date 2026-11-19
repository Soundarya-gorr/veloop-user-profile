# VELoop User Profile Management System

## Project Overview

A full-stack User Profile Management System developed as part of the VELoop Internship Task 14.

The application provides a user dashboard to manage profile information, view reward balances, track reward activity, and access achievements. It is developed using React.js, Flask, and MySQL.

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
- JWT Authentication

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
│   │   ├── AuthPage.jsx
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

## Implemented Features

### Frontend
- Modern VELoop dashboard interface
- Sidebar navigation
- User registration and login interface
- User profile page
- Profile editing functionality
- Rewards dashboard
- Reward activity display
- Achievements section integration

### Backend
- Flask REST API
- MySQL database connectivity
- User registration and login APIs
- Password hashing and verification
- JWT-based authentication
- User profile retrieval and update
- Reward balance API
- Reward activity API
- Achievements API
- Database integration using Flask-SQLAlchemy

### Rewards Integration
- Gems balance
- Tokens balance
- VELoop reward balances
- Reward activity history
- Achievement records and progress

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend status |
| GET | `/test-db` | Test database connection |
| POST | `/register` | Register a user |
| POST | `/login` | Authenticate a user |
| GET | `/rewards` | Retrieve reward balances |
| GET | `/reward-activity` | Retrieve reward activity |
| GET | `/achievements` | Retrieve achievement records |

*Protected endpoints require valid authentication.*

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

Configure your MySQL database and required environment variables.

Start the backend:

```bash
python app.py
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Current Project Status

The project is under active development.

### Completed
- React frontend and Flask backend setup
- MySQL database integration
- User registration and login
- User profile retrieval and update
- Reward balance integration
- Reward activity integration
- Achievements backend API and database integration
- Frontend production build verification

### Work in Progress
- Completing Achievements frontend functionality
- Admin Panel and user management
- Additional authorization and security verification
- Complete application testing
- Deployment

## GitHub Repository

https://github.com/Soundarya-gorr/veloop-user-profile

## Developer

**Soundarya**

B.E. – Electrical and Electronics Engineering

## About

VELoop User Profile Management System – Internship Task 14.