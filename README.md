# Organ Donation Management System (ODMS)

A comprehensive organ donation and transplant management platform built with React, Firebase, and AI integration.

## 🚀 Features

- **Firebase Authentication**: Secure email/password authentication with role-based access
- **Firestore Database**: Real-time data storage for users, donors, patients, and organ requests
- **Role-based Access Control**: Donor, Patient, Admin, and Super Admin roles with specific permissions
- **AI-Powered Chatbot**: Gemini 1.5 Flash integration for intelligent organ donation support
- **Real-time Analytics**: Interactive dashboards with charts and live statistics
- **Organ Tracking**: Leaflet.js maps for tracking organ transportation (AP-focused)
- **Automatic Organ Matching**: AI-powered compatibility matching system
- **Modern UI**: Responsive design with Tailwind CSS and shadcn/ui components

## 🛠️ Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - **Authentication** with Email/Password provider
   - **Firestore Database** in production mode
   - **Cloud Functions** 
   - **Cloud Storage** (optional)

3. Get your Firebase configuration from Project Settings > General > Your apps

### 2. Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Firebase configuration values in `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 3. Firebase Functions Setup

1. Navigate to the functions directory:
```bash
cd functions
```

2. Install dependencies:
```bash
npm install
```

3. Set up Gemini API key as a secret:
```bash
firebase functions:secrets:set GEMINI_API_KEY
```
Enter your Gemini API key when prompted.

4. Build and deploy functions:
```bash
npm run build
npm run deploy
```

### 4. Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### 5. Gemini 1.5 Flash Integration

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the key to Firebase Functions secrets:
```bash
firebase functions:secrets:set GEMINI_API_KEY
```

The chatbot will automatically use the Cloud Function endpoint `/api/chat-gemini` for AI responses.

## 👥 User Roles & Features

### 🩸 Donor
- Register with comprehensive organ selection (checkboxes)
- View donation profile and registration date
- Download donor certificate
- Update profile information
- Track donation history

### 🏥 Patient  
- Create detailed organ requests
- View request status and updates
- Track organ availability
- Access support resources

### 👨‍⚕️ Admin
- Manage organ requests (approve/reject)
- View and filter donor database
- Automatic organ matching algorithm
- Track organ transportation
- Hospital coordination features
- Delete user accounts (no role changes)

### 🔧 Super Admin
- Manage all users and roles
- Add new super administrators
- Real-time analytics dashboard with eye-catching charts
- System health monitoring
- Complete user management (including deletions)

## 📊 Firebase Collections Structure

### users
```json
{
  "id": "userId",
  "name": "User Name", 
  "email": "user@example.com",
  "role": "donor|patient|admin|superadmin",
  "createdAt": "timestamp",
  "phone": "optional",
  "bloodType": "A+|B-|AB+|AB-|O+|O-",
  "organs": ["heart", "kidney", "liver"],
  "dateOfBirth": "YYYY-MM-DD",
  "emergencyContact": "optional"
}
```

### requests
```json
{
  "id": "requestId",
  "patientId": "userId", 
  "patientName": "Patient Name",
  "requiredOrgan": "heart|kidney|liver|lung|pancreas|cornea",
  "bloodType": "A+|B-|AB+|AB-|O+|O-",
  "urgencyLevel": "Low|Medium|High",
  "status": "Pending|Approved|Rejected",
  "hospitalName": "Hospital Name",
  "age": 35,
  "createdAt": "timestamp"
}
```

## 🧪 Testing & Validation

### Build Test
```bash
npm run build
```

### Type Check
```bash
npx tsc --noEmit
```

### Firebase Emulators (Development)
```bash
firebase emulators:start
```

### Linting
```bash
npm run lint
```

## 🌟 Key Features Implemented

✅ **Firebase Authentication** - Email/password with role-based access  
✅ **Firestore Integration** - Real-time database operations  
✅ **AI Chatbot** - Gemini 1.5 Flash powered support with system persona  
✅ **Analytics Dashboard** - Real-time charts with no runtime errors  
✅ **Organ Tracking** - Leaflet.js interactive maps (AP-focused)  
✅ **Automatic Matching** - AI-powered organ-patient compatibility  
✅ **Contact Page** - AI ChatBot integration (no old forms)  
✅ **Responsive Design** - Mobile-first Tailwind CSS styling  
✅ **TypeScript** - Full type safety throughout the application  
✅ **Security Rules** - Firestore and Storage rules configured  

## 🚀 Production Deployment

1. Ensure all environment variables are set
2. Build the application:
```bash
npm run build
```

3. Deploy to Firebase Hosting:
```bash
firebase deploy
```

4. Verify all Firebase services:
   - ✅ Authentication (Email/Password enabled)
   - ✅ Firestore (Rules and indexes deployed)
   - ✅ Cloud Functions (chat-gemini deployed)
   - ✅ Hosting (Rewrites configured for SPA)

## 🏥 Andhra Pradesh Focus

This system is specifically configured for Andhra Pradesh organ donation:
- **Map Center**: Focused on AP coordinates (17.0000, 79.0000)
- **Hospital Contacts**: AP medical centers included
- **Donor Registration**: AP-specific donor locations in mock data
- **Emergency Contacts**: Local AP emergency numbers

## 🤖 AI Chatbot Configuration

The Gemini 1.5 Flash chatbot includes:
- **System Persona**: Dr. LifeSaver - organ donation expert
- **RAG Knowledge**: FAQs, policies, hospital contacts
- **Safety Rules**: Medical disclaimers and appropriate referrals
- **Example Conversations**: Pre-trained responses
- **Evaluation Suite**: Response quality criteria

## 🔒 Security & Privacy

- All API keys stored as Firebase secrets (not in code)
- Firestore security rules enforce role-based access
- Input validation and sanitization
- Medical data handled with appropriate disclaimers
- Emergency contact integration for critical situations

## 📞 Support

For technical support or questions:
- Use the AI chatbot for immediate assistance
- Emergency Hotline: 1-800-ORGAN-1
- Email: info@organconnect.org

## 📋 Environment Requirements

- Node.js 18+
- Firebase CLI
- Valid Firebase project
- Gemini API key

---

**Note**: This system contains placeholder data and should be configured with real medical contacts and procedures before production use.