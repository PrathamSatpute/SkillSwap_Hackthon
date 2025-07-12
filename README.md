# SkillSwap 🔄

A modern skill-sharing platform that connects people to learn and teach skills through peer-to-peer exchanges. Built with React, TypeScript, and Firebase for real-time collaboration.

![SkillSwap Preview](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.0.0-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC?logo=tailwind-css)

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Registration/Login**: Email-based authentication with Firebase
- **Profile Management**: Complete user profiles with skills, availability, and preferences
- **Privacy Controls**: Public/private profile settings
- **Session Management**: Persistent login with secure token handling

### 🎯 Skill Management
- **Skill Categories**: Programming, Design, Marketing, Business, Language, Music, Photography, Writing, Cooking, Fitness
- **Skill Levels**: Beginner, Intermediate, Advanced, Expert
- **Availability Scheduling**: Flexible time slots for skill exchanges
- **Skill Descriptions**: Detailed skill information and learning objectives

### 🤝 Skill Swapping System
- **Request Management**: Create and manage skill exchange requests
- **Real-time Notifications**: Instant updates on request status changes
- **Rating System**: Post-exchange feedback and ratings
- **Status Tracking**: Pending, Accepted, Completed, Cancelled states

### 🔍 Advanced Search & Discovery
- **Multi-criteria Search**: Search by skill, category, location, and availability
- **Real-time Filtering**: Dynamic results as you type
- **Category-based Browsing**: Explore skills by category
- **Location-based Matching**: Find users in your area

### 👨‍💼 Admin Panel
- **User Management**: View, ban, and manage user accounts
- **Platform Analytics**: Monitor platform usage and engagement
- **Content Moderation**: Review and moderate user-generated content
- **System Announcements**: Broadcast messages to all users

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Intuitive mobile interactions
- **Progressive Web App**: Fast loading and offline capabilities
- **Accessibility**: WCAG compliant design patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Copy your Firebase config to `src/config/firebase.ts`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern component library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons

### Backend & Services
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Authentication** - Secure user management
- **Firebase Storage** - File upload and storage

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── Auth/           # Login/Register forms
│   ├── Home/           # Main dashboard
│   ├── Profile/        # User profile management
│   ├── Swaps/          # Skill exchange features
│   ├── Admin/          # Admin panel
│   └── Layout/         # Header, Sidebar, etc.
├── contexts/           # React Context providers
├── utils/              # Helper functions
├── types/              # TypeScript definitions
└── config/             # Configuration files
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Main actions and branding
- **Secondary**: Purple (#8b5cf6) - Accent elements
- **Success**: Green (#10b981) - Positive actions
- **Warning**: Yellow (#f59e0b) - Caution states
- **Error**: Red (#ef4444) - Error states

### Typography
- **Font**: Inter (system fallback)
- **Responsive**: Scales appropriately across devices
- **Hierarchy**: Clear heading and text hierarchy

## 🔒 Security Features

- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Input sanitization
- **Authentication**: Secure Firebase Auth integration
- **Data Validation**: Server-side validation
- **Error Boundaries**: Graceful error handling


## 🙏 Acknowledgments

- Firebase for backend services
- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- All contributors and users of SkillSwap

