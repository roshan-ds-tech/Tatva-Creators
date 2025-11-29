#!/usr/bin/env python
"""Script to create Django superuser with detailed output"""
import os
import sys
import django

# Change to backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tatva_backend.settings')

try:
    django.setup()
    print("✓ Django setup successful")
except Exception as e:
    print(f"✗ Django setup failed: {e}")
    sys.exit(1)

from django.contrib.auth import get_user_model
from django.db import connection

User = get_user_model()
print(f"✓ User model loaded: {User}")

# Check database connection
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    print("✓ Database connection successful")
except Exception as e:
    print(f"✗ Database connection failed: {e}")
    print("Run: python manage.py migrate")
    sys.exit(1)

username = 'RoshanDS'
email = 'roshands@example.com'
password = 'hackerone007'

print(f"\nAttempting to create superuser:")
print(f"  Username: {username}")
print(f"  Email: {email}")
print(f"  Password: {password}")

# Delete existing user if exists
if User.objects.filter(username=username).exists():
    print(f"\n⚠ User '{username}' already exists. Deleting...")
    User.objects.filter(username=username).delete()
    print("✓ Existing user deleted")

if User.objects.filter(email=email).exists() and User.objects.get(email=email).username != username:
    print(f"\n⚠ User with email '{email}' already exists with different username")
    existing_user = User.objects.get(email=email)
    if existing_user.username != username:
        print(f"  Existing username: {existing_user.username}")

try:
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        first_name='Roshan',
        last_name='DS'
    )
    print(f"\n{'='*60}")
    print(f"✓✓✓ SUPERUSER CREATED SUCCESSFULLY! ✓✓✓")
    print(f"{'='*60}")
    print(f"Username: {username}")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"Is Superuser: {user.is_superuser}")
    print(f"Is Staff: {user.is_staff}")
    print(f"{'='*60}\n")
    
    # Verify
    verify_user = User.objects.get(username=username)
    if verify_user.check_password(password):
        print("✓ Password verification: SUCCESS")
    else:
        print("✗ Password verification: FAILED")
        
except Exception as e:
    print(f"\n✗✗✗ ERROR CREATING SUPERUSER ✗✗✗")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {str(e)}")
    import traceback
    print("\nFull traceback:")
    traceback.print_exc()
    sys.exit(1)


