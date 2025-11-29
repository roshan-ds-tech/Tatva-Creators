#!/usr/bin/env python
"""
Alternative script to create superuser - can be run directly
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tatva_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = 'RoshanDS'
email = 'roshands@example.com'
password = 'hackerone007'

# Delete existing user if exists (optional - comment out if you want to keep existing)
if User.objects.filter(username=username).exists():
    User.objects.filter(username=username).delete()
    print(f'Deleted existing user "{username}"')

# Create superuser
User.objects.create_superuser(
    username=username,
    email=email,
    password=password,
    first_name='Roshan',
    last_name='DS'
)

print(f'✓ Superuser created successfully!')
print(f'  Username: {username}')
print(f'  Email: {email}')
print(f'  Password: {password}')


