#!/bin/bash
echo "Creating Django superuser..."

python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
username = 'RoshanDS'
email = 'roshands@example.com'
password = 'hackerone007'

if User.objects.filter(username=username).exists():
    user = User.objects.get(username=username)
    user.delete()
    print(f'Deleted existing user: {username}')

user = User.objects.create_superuser(
    username=username,
    email=email,
    password=password,
    first_name='Roshan',
    last_name='DS'
)
print(f'Superuser {username} created successfully!')
print(f'Username: {username}')
print(f'Password: {password}')
EOF


