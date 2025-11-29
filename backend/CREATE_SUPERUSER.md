# Create Superuser Instructions

## Quick Method (Windows PowerShell)

Run this command from the `backend` directory:

```powershell
python manage.py shell
```

Then paste this code:
```python
from django.contrib.auth import get_user_model
User = get_user_model()

username = 'RoshanDS'
email = 'roshands@example.com'
password = 'hackerone007'

# Delete existing user if exists
if User.objects.filter(username=username).exists():
    User.objects.filter(username=username).delete()
    print(f'Deleted existing user: {username}')

# Create superuser
user = User.objects.create_superuser(
    username=username,
    email=email,
    password=password,
    first_name='Roshan',
    last_name='DS'
)

print(f'✓ Superuser created successfully!')
print(f'Username: {username}')
print(f'Email: {email}')
print(f'Password: {password}')
```

Type `exit()` to exit the shell.

## Alternative: Using Management Command

I've created a custom management command. First, make sure migrations are run:

```bash
python manage.py makemigrations
python manage.py migrate
```

Then run:
```bash
python manage.py createsuperuser_custom
```

## One-Line Command (Windows)

From the `backend` directory:

```powershell
python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tatva_backend.settings'); django.setup(); from django.contrib.auth import get_user_model; User = get_user_model(); username='RoshanDS'; email='roshands@example.com'; password='hackerone007'; User.objects.filter(username=username).delete() if User.objects.filter(username=username).exists() else None; user = User.objects.create_superuser(username=username, email=email, password=password, first_name='Roshan', last_name='DS'); print(f'Superuser {username} created!')"
```

## Important Notes

1. **Make sure migrations are run first:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Make sure virtual environment is activated:**
   ```bash
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   ```

3. The superuser will have:
   - Username: `RoshanDS`
   - Email: `roshands@example.com`
   - Password: `hackerone007`
   - Admin access: Yes

## Verify Superuser

After creating, you can verify by:
1. Starting the server: `python manage.py runserver`
2. Going to: `http://localhost:8000/admin`
3. Logging in with the credentials above


