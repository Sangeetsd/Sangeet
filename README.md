# Sangeet Distribution Platform - Documentation

## Overview
Sangeet Distribution is a modern, professional music distribution platform that allows artists and labels to distribute their music to major streaming platforms, manage releases, track royalties, and collaborate with other artists.

## Project Structure
- `css/` - Contains all CSS files
  - `stailisa.css` - Main CSS framework
  - `responsive.css` - Responsive design styles
- `js/` - Contains all JavaScript files
  - `main.js` - Main JavaScript functionality
  - `firebase-service.js` - Firebase core services
  - `auth-service.js` - Authentication services
  - `signup.js` - Signup page functionality
  - `responsive.js` - Responsive design enhancements
- `images/` - Directory for image assets
- `admin/` - Admin panel pages
- `dashboard/` - User dashboard pages

## Features Implemented

### Frontend
- Modern landing page with hero section
- Clean navigation bar with mobile responsiveness
- Feature sections highlighting platform capabilities
- Pricing plans with toggle between monthly/yearly
- Testimonials carousel
- Comprehensive footer section
- Fully responsive design for all device sizes

### User Dashboard
- Secure login/signup system
- Music upload section with metadata management
- Release manager to track status of releases
- Royalty earnings dashboard with charts
- Collaborator payment split tool
- Support ticket system

### Admin Panel
- Admin login with role-based access
- DSP API integration management
- User management interface
- Catalog management system
- Royalty ingestion system
- Fraud detection system
- Release review interface
- DSP delivery logs and status reports

### Firebase Integration
- Complete authentication system
- Firestore database configuration
- User profile management
- Role-based access control

### Responsive Design
- Mobile-first approach
- Media queries for different screen sizes
- Touch-friendly enhancements
- Responsive tables and forms
- Mobile navigation optimizations
- Print styles and accessibility features

## Firebase Configuration
The platform uses Firebase for authentication, database, and storage. The Firebase configuration is:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDJ7M2IJI16jWxegtilyDbkgfQNHtMI7Lo",
  authDomain: "sangeet-distribution-81eb3.firebaseapp.com",
  projectId: "sangeet-distribution-81eb3",
  storageBucket: "sangeet-distribution-81eb3.firebasestorage.app",
  messagingSenderId: "522922846685",
  appId: "1:522922846685:web:631ead8e6ccdbfc2a4ae34",
  measurementId: "G-6CX21QGNLE"
};
```

## Getting Started

### Local Development
1. Extract the zip file to your local development environment
2. Open the project in your preferred code editor
3. Use a local server to view the project (e.g., Live Server extension in VS Code)
4. Navigate to `index.html` to view the landing page

### Deployment
The project is ready for deployment to any web hosting service. Simply upload all files maintaining the directory structure.

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication, Firestore Database, and Storage
3. Update the Firebase configuration in `js/main.js` if needed
4. Set up security rules for Firestore and Storage

## Future Enhancements
- Complete Firebase Storage implementation
- Set up security rules for Firebase
- Add more DSP integrations
- Implement advanced analytics
- Add multi-language support

## Credits
- Font Awesome for icons
- Google Fonts for typography (Inter, Montserrat)
- Firebase for backend services

## Support
For any questions or support needs, please contact the development team.
