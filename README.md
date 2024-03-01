# ChatNow ![logo](/public/favicon.ico) - Real-time Web Chat Application

ChatNow is a real-time web chat application built using Firebase for backend services and React for the frontend. This project was created as a learning and practice exercise to explore Firebase integration, TypeScript, and other web development technologies.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [How to Use](#how-to-use)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time chat functionality.
- Firebase authentication for user management.
- User status tracking (Online/Offline).
- Message history stored in Cloud Firestore.
- Image and text message support.
- Timestamps for messages.
- Firestore for real-time database.
- TypeScript integration for enhanced code readability.
- Modern UI design for seamless user experience.

## Screenshots

![Screenshot 1](/screenshots/screenshot1.png)
![Screenshot 2](/screenshots/screenshot2.gif)

## Technologies Used

- **Frontend:**
  - React: JavaScript library for building user interfaces.
  - TypeScript: Typed superset of JavaScript for improved code quality.
  - Material-UI: React components for a responsive design.
  - Firebase Authentication: User authentication and authorization.
  - Firebase Firestore: Cloud-based NoSQL database for storing messages and user data.

- **Backend:**
  - Firebase Cloud Functions: Serverless functions for additional backend logic.

## How to Use

1. **Create Account:**
   - Sign up for a new account or sign in if you already have one.

2. **Start a Chat:**
   - Initiate a new chat by searching for a user.

3. **Enjoy Real-time Chat:**
   - Send messages, images, and enjoy real-time chat functionality.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: [Download Node.js](https://nodejs.org/)

### Installation

To get started with ChatNow, follow these steps:

1. Clone the repository.
   ```bash
   git clone https://github.com/s-shemmee/ChatNow.git
   ```

2. Install dependencies.
   ```bash
   cd ChatNow
   npm install
   ```

3. Set up Firebase.
   - Create a new project on [Firebase](https://firebase.google.com/).
   - Obtain your Firebase configuration and update `firebase.tsx`.
   - Set up Firestore and Storage in your Firebase project.

4. Run the application.
   ```bash
   npm run dev
   ```

5. Open the app in your browser: [http://localhost:3000](http://localhost:3000).

## Contributing

Contributions are welcome! If you find any issues or have suggestions, feel free to open an issue or create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
