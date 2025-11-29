#!/usr/bin/env python
"""
Script to create a Django superuser non-interactively.
Usage: python create_superuser.py
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tatva_backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superuser():
    username = 'RoshanDS'
    email = 'roshands@example.com'  # You can change this email
    password = 'hackerone007'
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f'User with username "{username}" already exists!')
        return
    
    if User.objects.filter(email=email).exists():
        print(f'User with email "{email}" already exists!')
        return
    
    # Create superuser
    try:
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            first_name='Roshan',
            last_name='DS'
        )
        print(f'Superuser "{username}" created successfully!')
        print(f'Email: {email}')
        print(f'Password: {password}')
    except Exception as e:
        print(f'Error creating superuser: {e}')

if __name__ == '__main__':
    create_superuser()


