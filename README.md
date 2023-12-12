# Calculator Web Application

This is a web-based calculator application built with React.js for the front end and Firebase Cloud Functions for the back end. The application offers basic arithmetic operations, currency formatting, user authentication, and a history management feature.

## Table of Contents

- [Calculator Web Application](#calculator-web-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Firestore Rules](#firestore-rules)
    - [Configuration](#configuration)
    - [Installation](#installation)

## Features

- Basic arithmetic operations: Addition, Subtraction, Multiplication, Division.
- Currency formatting with options for USD and Euro.
- User authentication using Firebase Authentication.
- History management: View and delete individual calculation history entries.
- Responsive and user-friendly design.

## Technologies

- React.js
- Firebase (Authentication, Firestore, Cloud Functions)
- Create-React-App
- Lodash (for debouncing)

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Firebase project with Firestore and Authentication set up.

### Firestore Rules

Replace your firestore rules with this

``
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

### Configuration

1. Create a `.env` file in the root of the project.

2. Copy the Firebase configurations from your Firebase Console:

   - Go to your Firebase Console: [https://console.firebase.google.com/](https://console.firebase.google.com/).
   - Navigate to your project.
   - Click on the gear icon (Project settings) in the top left.
   - Under the General tab, scroll down to the "Your apps" section.
   - Click on the "</>" icon to add a web app.
   - Copy the Firebase configurations.

3. Paste the copied configurations into your `.env` file. Replace the placeholder values with the actual values:

   ```env
   React_APP_apiKey = your-api-key
   React_APP_authDomain = your-auth-domain
   React_APP_projectId = your-project-id
   React_APP_storageBucket = your-storage-bucket
   React_APP_messagingSenderId = your-messaging-sender-id
   React_APP_appId = your-app-id
   React_APP_measurementId = your-measurement-id

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/calculator-app.git
cd calculator-app
npm i
npm start