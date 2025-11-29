# Quick Setup Guide

## Step-by-Step Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Create Database and Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```
Follow the prompts to create an admin user.

### 7. Run Development Server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## Testing the API

### Using curl

**Signup:**
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "confirm_password": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Get Profile (replace ACCESS_TOKEN with actual token):**
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Admin Panel

Access the Django admin panel at: `http://localhost:8000/admin/`

Use the superuser credentials created in step 6.


