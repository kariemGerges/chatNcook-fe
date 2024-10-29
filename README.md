
# ChatCook

**ChatCook** is a mobile application designed to create a community where users can discover, share, and add recipes, as well as communicate through a real-time chat feature. The application is built with **React Native** using **Expo** and integrates MongoDB and Firebase for data storage and real-time chat, respectively.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Recipe Sharing:** Users can add their own recipes, which are saved in MongoDB for quick retrieval and community sharing.
- **Real-Time Chat:** A chat feature similar to WhatsApp enables users to connect in real time using Firebase.
- **Home Tab:** Displays recent chats and recipes in one view.
- **Dedicated Tabs:** Users can easily navigate between **Chats** and **Recipes** tabs for a focused experience.

## Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Firebase for real-time chat, MongoDB for recipe storage
- **APIs:** Firebase Authentication, Firestore for chat, and MongoDB for recipes

## Setup

### Prerequisites

1. **Node.js** and **npm** installed on your machine.
2. **Expo CLI**: Install with `npm install -g expo-cli`.
3. **MongoDB Database** and **Firebase Project** setup.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ChatCook.git
   cd ChatCook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables (see below).

4. Start the development server:
   ```bash
   expo start
   ```

## Project Structure

```plaintext
.
├── app
│   ├── screens
│   │   ├── HomeScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── RecipesScreen.tsx
│   └── components
├── hooks
│   ├── useColorScheme.ts
│   └── useThemeColor.ts
├── services
│   ├── firebaseConfig.ts  // Firebase configuration and initialization
│   ├── mongodbService.ts  // MongoDB connection and functions
├── App.tsx
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
MONGO_URI=your_mongo_connection_string
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

> Note: Replace values with your MongoDB and Firebase credentials.

## Usage

1. **Recipe Sharing**
   - Users can add recipes, which are stored in MongoDB and accessible to other users.

2. **Real-Time Chat**
   - Chat functionality allows users to communicate in real time using Firebase Firestore as the backend.

3. **Navigation**
   - The app has three main tabs: **Home**, **Chats**, and **Recipes**.
   - **Home Tab** provides an overview of recent chats and recipe additions.
   - **Chats Tab** and **Recipes Tab** provide focused views on communication and recipes.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request.

## License

This project is licensed under the MIT License. 
made with love by Kariem Gerges