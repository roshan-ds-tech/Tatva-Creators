#!/usr/bin/env python
"""
Complete setup script that:
1. Makes migrations
2. Runs migrations
3. Creates the superuser
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tatva_backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    print("Make sure you're in the backend directory and have run: pip install -r requirements.txt")
    sys.exit(1)

from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.db import connection

def setup_database():
    """Run migrations"""
    print("Running migrations...")
    try:
        call_command('makemigrations', verbosity=0)
        call_command('migrate', verbosity=0)
        print("✓ Migrations completed")
    except Exception as e:
        print(f"Error running migrations: {e}")
        return False
    return True

def create_superuser():
    """Create the superuser"""
    User = get_user_model()
    
    username = 'RoshanDS'
    email = 'roshands@example.com'
    password = 'hackerone007'
    
    print(f"\nCreating superuser...")
    print(f"Username: {username}")
    print(f"Email: {email}")
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists. Updating to superuser...")
        user = User.objects.get(username=username)
        user.is_superuser = True
        user.is_staff = True
        user.email = email
        user.first_name = 'Roshan'
        user.last_name = 'DS'
        user.set_password(password)
        user.save()
        print(f"✓ Updated user '{username}' to superuser with new password!")
    elif User.objects.filter(email=email).exists():
        print(f"User with email '{email}' already exists. Skipping...")
    else:
        try:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name='Roshan',
                last_name='DS'
            )
            print(f"✓ Superuser '{username}' created successfully!")
        except Exception as e:
            print(f"✗ Error creating superuser: {e}")
            return False
    
    print(f"\n{'='*50}")
    print(f"SUPERUSER CREDENTIALS:")
    print(f"  Username: {username}")
    print(f"  Email: {email}")
    print(f"  Password: {password}")
    print(f"{'='*50}\n")
    
    return True

if __name__ == '__main__':
    print("="*50)
    print("Django Backend Setup & Superuser Creation")
    print("="*50)
    
    # Setup database
    if not setup_database():
        print("Setup failed. Please check errors above.")
        sys.exit(1)
    
    # Create superuser
    if create_superuser():
        print("✓ Setup complete!")
        print("\nYou can now:")
        print("  1. Run: python manage.py runserver")
        print("  2. Visit: http://localhost:8000/admin")
        print("  3. Login with the credentials above")
    else:
        print("✗ Superuser creation failed.")
        sys.exit(1)


