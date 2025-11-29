# Tatva Backend - Django Authentication API

This is the Django REST API backend for the Tatva e-commerce platform, providing authentication endpoints.

## Features

- User registration (signup)
- User login with JWT authentication
- User profile retrieval
- JWT token refresh
- CORS enabled for React frontend

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/signup/` - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password123", "confirm_password": "password123", "first_name": "John", "last_name": "Doe" }`
  - Response: User data and JWT tokens

- `POST /api/auth/login/` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: User data and JWT tokens

- `GET /api/auth/profile/` - Get current user profile (requires authentication)
  - Headers: `Authorization: Bearer <access_token>`
  - Response: User data

- `POST /api/auth/token/refresh/` - Refresh access token
  - Body: `{ "refresh": "<refresh_token>" }`
  - Response: New access token

## Frontend Integration

The React frontend should make requests to these endpoints and store the JWT tokens (access and refresh) for authenticated requests.

### Example Frontend Usage

```javascript
// Signup
const response = await fetch('http://localhost:8000/api/auth/signup/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    confirm_password: 'password123',
    first_name: 'John',
    last_name: 'Doe'
  })
});

const data = await response.json();
// Store tokens: data.tokens.access and data.tokens.refresh

// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Authenticated Request
const profileResponse = await fetch('http://localhost:8000/api/auth/profile/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
});
```

## Environment Variables

For production, set these environment variables:

- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to False in production
- `ALLOWED_HOSTS` - Add your domain
- `DATABASE_URL` - Database connection string (if not using SQLite)

## Security Notes

- Change `SECRET_KEY` in settings.py before deploying to production
- Use environment variables for sensitive configuration
- Enable HTTPS in production
- Configure proper CORS origins for production
- Use a production-grade database (PostgreSQL recommended)


