"""Test script to verify superuser was created"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tatva_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = 'RoshanDS'
email = 'roshands@example.com'

print('Checking for superuser...')
print('='*60)

if User.objects.filter(username=username).exists():
    user = User.objects.get(username=username)
    print(f'✓ User found: {username}')
    print(f'  Email: {user.email}')
    print(f'  Is Superuser: {user.is_superuser}')
    print(f'  Is Staff: {user.is_staff}')
    print(f'  First Name: {user.first_name}')
    print(f'  Last Name: {user.last_name}')
    
    # Test password
    if user.check_password('hackerone007'):
        print('  ✓ Password is correct')
    else:
        print('  ✗ Password check failed')
else:
    print(f'✗ User not found: {username}')

if User.objects.filter(email=email).exists():
    user = User.objects.get(email=email)
    print(f'✓ User found by email: {email}')
else:
    print(f'✗ User not found by email: {email}')

print('='*60)


