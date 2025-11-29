# Backend Integration Guide

This guide explains how to set up and integrate the Django backend with the React frontend.

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Start the Django server:**
   ```bash
   python manage.py runserver
   ```
   
   The backend will run on `http://localhost:8000`

## Frontend Integration

The frontend has been updated to use the Django API. The API utility functions are located in `src/utils/api.ts`.

### API Endpoints

- **Signup**: `POST http://localhost:8000/api/auth/signup/`
- **Login**: `POST http://localhost:8000/api/auth/login/`
- **Profile**: `GET http://localhost:8000/api/auth/profile/` (requires authentication)
- **Token Refresh**: `POST http://localhost:8000/api/auth/token/refresh/`

### Updated Components

1. **Signup.tsx** - Now makes API calls to the Django backend
2. **Login.tsx** - Now authenticates with the Django backend

### Running Both Servers

1. **Terminal 1 - Django Backend:**
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   python manage.py runserver
   ```

2. **Terminal 2 - React Frontend:**
   ```bash
   npm run dev
   ```

## Testing the Integration

1. **Start both servers** (backend on port 8000, frontend on port 5173)

2. **Test Signup:**
   - Navigate to `http://localhost:5173/signup`
   - Fill in the form and submit
   - Check the browser console for API responses
   - Check Django server logs for incoming requests

3. **Test Login:**
   - Navigate to `http://localhost:5173/login`
   - Use the credentials you just created
   - You should be redirected to `/products` on success

## API Response Format

### Successful Signup/Login Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_joined": "2024-01-01T12:00:00Z"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Error Response:
```json
{
  "error": "Invalid email or password"
}
```
or
```json
{
  "email": ["This field is required."],
  "password": ["This password is too short."]
}
```

## Troubleshooting

### CORS Errors
If you encounter CORS errors, make sure:
- The backend is running on `http://localhost:8000`
- The frontend is running on `http://localhost:5173` (Vite default)
- CORS settings in `backend/tatva_backend/settings.py` include your frontend URL

### Connection Errors
- Verify the backend is running: `http://localhost:8000/api/auth/signup/`
- Check the API_BASE_URL in `src/utils/api.ts`
- Check browser console for detailed error messages

### Authentication Errors
- Tokens are stored in localStorage
- Access tokens expire after 1 hour
- Refresh tokens expire after 7 days
- Use the refresh token endpoint to get a new access token

## Next Steps

- Add logout functionality that clears tokens
- Implement token refresh on API calls
- Add protected routes that require authentication
- Add error handling for network failures
- Add loading states during API calls


