# ChatNCook

ChatNCook is a cross-platform mobile app for sharing and discussing recipes in real time. Built with React Native, Expo, and TypeScript on the frontend, it leverages Firebase for authentication and chat, and a Node.js / Express + MongoDB backend for recipe storage and management.

## Features

- **Real-time chat**: One-to-one and group conversations powered by Firebase Firestore.
- **Recipe library**: Browse, create, edit, and delete recipes stored in MongoDB.
- **Home feed**: Combined view of recent chats and trending recipes.
- **Three-tab navigation**: Home, Chats, Recipes.
- **User authentication**: Email/password sign-up and login via Firebase Auth.

## Tech Stack

- **Frontend**:  
  - React Native (Expo)  
  - TypeScript  
  - React Navigation (Tabs)  
  - Redux / RTK Query (state management)  
- **Chat Backend**:  
  - Firebase Auth & Firestore  
- **Recipe Backend**:  
  - Node.js / Express  
  - MongoDB (Atlas)  
- **Dev & Deployment**:  
  - Expo CLI  
  - GitHub Actions (CI/CD)  
  - Heroku / Render (backend)

## Prerequisites

- Node.js 14+  
- Yarn or npm  
- Expo CLI (`npm install -g expo-cli`)  
- A Firebase project with Auth & Firestore enabled  
- A MongoDB Atlas cluster and connection string

## Installation

1. **Clone repo**  
   ```bash
   git clone https://github.com/your-username/ChatNCook.git
   cd ChatNCook

   
/ChatNCook
│
├─ /backend           # Express API for recipes
│   ├─ /controllers
│   ├─ /models
│   └─ index.js
│
├─ /src               # React Native app
│   ├─ /components
│   ├─ /hooks
│   ├─ /screens
│   ├─ /store         # Redux slices & RTK Query
│   └─ App.tsx
│
├─ .env.example
└─ README.md
