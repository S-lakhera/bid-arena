# BidArena - Authentication Module Documentation

This document outlines the REST APIs that power the Authentication and Authorization flows in BidArena.

## 🔗 REST API Endpoints
Base URL: `/api/v1/auth`

### 1. Register User
- **Method:** `POST`
- **Path:** `/api/v1/auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
- **Returns:** User object and authentication token(s).

### 2. Login User
- **Method:** `POST`
- **Path:** `/api/v1/auth/login`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
- **Returns:** User object and authentication token(s).

### 3. Get Current User (Me)
- **Method:** `GET`
- **Path:** `/api/v1/auth/me`
- **Access:** Protected (Requires Authentication Token)
- **Returns:** The currently authenticated user's details.

### 4. Refresh Token
- **Method:** `POST`
- **Path:** `/api/v1/auth/refresh-token`
- **Access:** Public (Requires valid refresh token, usually sent in cookies)
- **Returns:** A new access token.

### 5. Logout User
- **Method:** `POST`
- **Path:** `/api/v1/auth/logout`
- **Access:** Protected
- **Returns:** Clears authentication cookies/tokens and logs out the user.

---

## 🌐 Google OAuth Integration

BidArena also supports signing in via Google.

### 1. Initiate Google Login
- **Method:** `GET`
- **Path:** `/api/v1/auth/google`
- **Access:** Public
- **Description:** Redirects the user to the Google Consent Screen.

### 2. Google OAuth Callback
- **Method:** `GET`
- **Path:** `/api/v1/auth/google/callback`
- **Access:** Public
- **Description:** The callback URL that Google redirects to after the user authorizes the app. It handles the authentication and issues the required tokens before redirecting the user back to the frontend application.
