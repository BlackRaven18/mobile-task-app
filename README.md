# Secure Task Management Application
The application is designed to manage task lists with enhanced protection against Man-in-the-Middle (MITM) attacks. It prioritizes secure data storage, encrypted communication, and robust user authentication to ensure a high level of security for mobile application users.

While the application successfully implements several security features, certain aspects remain incomplete:
- **HTTPS Communication**: Implementing HTTPS with self-signed certificates was not fully successful due to compatibility issues with Android devices and modern browsers.
- **Database Encryption**: Attempts to encrypt the local database using SQLCipher via `expo-sqlite` were not successful, and the data remains unencrypted.

## Features
### Task Management
- **Task Lists**: Users can create, edit, delete, and manage task lists.
- **Tasks**: Tasks can be added, edited, deleted, or marked as completed. Users can attach contact information to tasks.
- **Synchronization**: Automatic synchronization of task lists and tasks with the backend server.

### Security Features
- **JWT Authentication**:
  - Secure access and refresh tokens for user sessions.
  - Short-lived access tokens mitigate the risk of token theft.
- **Permission Management**: Minimal permissions requested for accessing user data, such as contacts.
- **Certificate Pinning**: Implemented for additional protection against MITM attacks.

> ⚠️ **Limitations**:
> - **HTTPS**: The use of self-signed certificates caused compatibility issues, preventing secure HTTPS communication.
> - **Database Encryption**: Local data stored in SQLite is not encrypted due to limitations in the current implementation.

### Additional Functionalities
- User registration and login with secure password handling.
- Seamless user experience with responsive designs and error messages for invalid inputs.

## Technologies Used
- **React Native (Expo)**: For building a robust and user-friendly mobile application.
- **SQLite (via expo-sqlite)**: Local database for offline task storage.
- **Node.js**: Backend server for secure data handling and API endpoints.
- **JWT**: Secure authentication and session management.
- **Axios**: API communication with built-in interceptors for token handling.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Mobile Application](#mobile-application)
    - [Backend Server](#backend-server)
- [Functionalities](#functionalities)
- [Screenshots](#screenshots)

## Getting Started
Follow these instructions to set up the project on your local development environment.

### Prerequisites
- **Node.js**: 20.11.1 or higher
- **Expo CLI**: Latest version

### Installation
#### Mobile Application
1. Clone the repository:
   ```bash
   git clone https://github.com/BlackRaven18/secure-task-manager.git
   ```
2. Navigate to the project directory:
   ```bash
   cd secure-task-manager
   ```
3. Nagivate to mobile app directory:
   ```bash
   cd task-app
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a .env file in the root of the mobile application directory and add the backend API URL
   ```bash
   EXPO_PUBLIC_BACKEND_API_URL=[backend url]
   ```
   
   Example:
   
   ```
   EXPO_PUBLIC_BACKEND_API_URL=EXPO_PUBLIC_BACKEND_API_URL=http://192.168.1.5:3000
   ```
7. Start the Expo server:
   ```bash
   npm start
   ```
8. Test the application on a connected device or simulator using the Expo Go app.

#### Backend Server
The backend server ensures secure storage and processing of user data. Set up the backend as follows:
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
4. Create a .env file in the root of the backend directory and add the following configuration:
   ```
   JWT_SECRET_KEY="auth-secret-key"
   JWT_REFRESH_SECRET_KEY="refresh-secret-key"
   JWT_TOKEN_EXPIRE_TIME="60s"
   JWT_REFRESH_TOKEN_EXPIRE_TIME="7days"
   ```
5. Start the server:
   ```bash
   node --watch server.js
   ```

## Functionalities
- **Task Synchronization**: Tasks are synced with the server, and updates are propagated bidirectionally.
- **Error Handling**: Graceful handling of invalid input and server errors.
- **Session Management**: Automatic renewal of access tokens, ensuring seamless user experience.

## Screenshots
| Login Screen | Task List | Add Task |
|--------------|-----------|----------|
| <img src="https://github.com/user-attachments/assets/7dcff886-7feb-485d-b98a-8a61de946a44" width="400"> | <img src="https://github.com/user-attachments/assets/083558a5-d735-4a3c-bd96-4cc3e61596cf" width="400"> | <img src="https://github.com/user-attachments/assets/1eccd5ab-4c9a-4c03-b8ca-582906446ba6" width="400"> |

## Conclusion
The Secure Task Management Application demonstrates the implementation of robust security features in a mobile application. However, challenges with HTTPS implementation and database encryption need to be addressed in future development phases. Despite these limitations, the project provides a strong foundation for secure task management.