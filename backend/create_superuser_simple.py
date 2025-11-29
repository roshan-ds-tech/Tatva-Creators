import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tatva_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = 'RoshanDS'
email = 'roshands@example.com'
password = 'hackerone007'

# Delete if exists (check both username and email)
if User.objects.filter(username=username).exists():
    User.objects.filter(username=username).delete()
    print('Deleted existing user with username:', username)

if User.objects.filter(email=email).exists():
    User.objects.filter(email=email).delete()
    print('Deleted existing user with email:', email)

# Create superuser - email is USERNAME_FIELD, so pass it as first arg
# But also provide username since it's in REQUIRED_FIELDS
try:
    user = User.objects.create_superuser(
        email=email,  # This is the USERNAME_FIELD
        username=username,  # Required field
        password=password,
        first_name='Roshan',
        last_name='DS'
    )
    print('='*60)
    print('SUCCESS! Superuser created successfully!')
    print('='*60)
    print(f'Username: {username}')
    print(f'Email: {email}')
    print(f'Password: {password}')
    print('='*60)
    print(f'Is Superuser: {user.is_superuser}')
    print(f'Is Staff: {user.is_staff}')
    print('='*60)
except Exception as e:
    print('ERROR:', str(e))
    print('Error type:', type(e).__name__)
    import traceback
    traceback.print_exc()

