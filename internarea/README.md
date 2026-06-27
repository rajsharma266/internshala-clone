# InternArea – Internshala Clone

A full-stack internship and job portal inspired by Internshala, developed as part of an internship assignment. The platform enables students to discover internships and jobs, apply online, create professional resumes, purchase subscription plans, interact through a public community, and provides an admin panel to manage jobs, internships, and applications.

---

# Project Overview

InternArea is a MERN/Next.js based internship management platform that provides a complete ecosystem for students and administrators.

Students can:

- Register and Login
- Login with Google
- Apply for Jobs
- Apply for Internships
- Create Professional Resume
- Purchase Subscription Plans
- Use Public Space
- View Login History
- Change Website Language
- Manage Profile

Administrators can:

- Login securely
- Post Jobs
- Post Internships
- Manage Jobs
- Manage Internships
- View Applications
- Monitor Platform Activities

---

# Features

## Student Features

- User Registration
- User Login
- Google Authentication
- Forgot Password
- Email OTP Verification
- Public Space
- Friends System
- Internship Listing
- Job Listing
- Resume Builder
- Login History
- Subscription Plans
- Multi-language Support
- User Profile

---

## Admin Features

- Secure Admin Login
- Dashboard
- Post Internship
- Manage Internships
- Post Job
- Manage Jobs
- View Student Applications
- Edit/Delete Jobs
- Edit/Delete Internships

---

# Internship Assignment Tasks

## Task 1 – Public Space

Implemented:

- Upload Photos
- Upload Videos
- Like Posts
- Comment
- Share Posts

Posting Rules:

- 0 Friends → Cannot Post
- 1 Friend → 1 Post per Day
- 2 Friends → 2 Posts per Day
- More than 10 Friends → Unlimited Posts

---

## Task 2 – Forgot Password

Implemented:

- Reset Password using Email
- Reset Password using Phone
- One Request per Day
- Random Password Generator
- Password contains only uppercase and lowercase alphabets

---

## Task 3 – Subscription Plans

Plans

- Free
- Bronze
- Silver
- Gold

Features

- Razorpay Integration
- Payment Verification
- Invoice Support
- Time-based Payment Restriction

---

## Task 4 – Resume Builder

Implemented

- Resume Form
- Email OTP
- Razorpay Payment
- Resume Generation
- Resume Attached to User Profile

---

## Task 5 – Multi-language Support

Supported Languages

- English
- Hindi
- Spanish
- Portuguese
- Chinese
- French

French language requires Email OTP Verification.

---

## Task 6 – Login History & Security

Stores

- Browser
- Operating System
- Device Type
- IP Address
- Login Time
- Login Status

Security Rules

- Chrome Browser OTP Verification
- Mobile Login Time Restriction

---

# Technology Stack

## Frontend

- Next.js
- React.js
- TypeScript
- CSS
- Firebase Authentication

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## Authentication

- JWT
- Email OTP
- Google Authentication

## Payment Gateway

- Razorpay

## Cloud Storage

- Cloudinary

---

# Project Structure

```
backend/
│
├── Model
├── Routes
├── Middleware
├── Utils
├── Config
└── Server.js

internarea/
│
├── src
│   ├── Components
│   ├── pages
│   ├── styles
│   ├── models
│   └── utils
└── public
```

---

# Installation

## Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

## Backend

```bash
cd backend
npm install
npm start
```

## Frontend

```bash
cd internarea
npm install
npm run dev
```

Frontend runs on

```
http://localhost:3000
```

---

# Environment Variables

Create the required `.env` files.

Backend

```
MONGODB_URI=
EMAIL_USER=
EMAIL_PASS=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Frontend

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

**Do not commit actual secret values to GitHub.**

---

# API Modules

- Authentication API
- Public Space API
- Friends API
- Resume API
- Subscription API
- Language API
- Login History API
- Job API
- Internship API
- Application API

---

# Database Collections

- Users
- Jobs
- Internships
- Applications
- Posts
- Friends
- LoginHistory
- Resume
- Subscription
- Payments

---

# Deployment

Frontend

```
To be updated after deployment
```

Backend

```
To be updated after deployment
```

---

# GitHub Repository

```
To be updated after pushing the project to GitHub
```

---

# Testing

Tested Modules

- User Authentication
- OTP Verification
- Google Login
- Forgot Password
- Public Space
- Resume Builder
- Razorpay Integration
- Language Change
- Login History
- Job Management
- Internship Management
- Applications

---

# Future Enhancements

- Company Dashboard
- Recruiter Portal
- Chat System
- Notifications
- AI Resume Review
- AI Job Recommendation
- Interview Scheduling
- Analytics Dashboard

---

# Developer

**Raj Sharma**

B.Tech – Computer Science Engineering

MERN Stack Developer

---

# License

This project is developed for educational and internship evaluation purposes only.