import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tatva_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Admin credentials
admin_email = 'roshands00270@gmail.com'
admin_password = 'hackerone007'
admin_username = 'roshands00270'  # Username derived from email

print('='*60)
print('Creating Admin User')
print('='*60)
print(f'Email: {admin_email}')
print(f'Password: {admin_password}')
print('='*60)

# Delete if exists (check both email and username)
if User.objects.filter(email=admin_email).exists():
    User.objects.filter(email=admin_email).delete()
    print(f'Deleted existing user with email: {admin_email}')

if User.objects.filter(username=admin_username).exists():
    User.objects.filter(username=admin_username).delete()
    print(f'Deleted existing user with username: {admin_username}')

# Create superuser/admin
try:
    user = User.objects.create_superuser(
        email=admin_email,  # This is the USERNAME_FIELD
        username=admin_username,  # Required field
        password=admin_password,
        first_name='Roshan',
        last_name='DS'
    )
    print('='*60)
    print('SUCCESS! Admin user created successfully!')
    print('='*60)
    print(f'Email: {admin_email}')
    print(f'Username: {admin_username}')
    print(f'Password: {admin_password}')
    print(f'Is Superuser: {user.is_superuser}')
    print(f'Is Staff: {user.is_staff}')
    print('='*60)
    print('\nYou can now log in to the admin dashboard with:')
    print(f'  Email: {admin_email}')
    print(f'  Password: {admin_password}')
    print('='*60)
except Exception as e:
    print('ERROR:', str(e))
    print('Error type:', type(e).__name__)
    import traceback
    traceback.print_exc()
