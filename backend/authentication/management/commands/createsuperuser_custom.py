from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a superuser with predefined credentials'

    def handle(self, *args, **options):
        username = 'RoshanDS'
        email = 'roshands@example.com'
        password = 'hackerone007'
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User with username "{username}" already exists!')
            )
            # Update existing user to be superuser
            user = User.objects.get(username=username)
            user.is_superuser = True
            user.is_staff = True
            user.set_password(password)
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f'Updated user "{username}" to superuser with new password!')
            )
            return
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'User with email "{email}" already exists!')
            )
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
            self.stdout.write(
                self.style.SUCCESS(f'✓ Superuser "{username}" created successfully!')
            )
            self.stdout.write(f'  Username: {username}')
            self.stdout.write(f'  Email: {email}')
            self.stdout.write(f'  Password: {password}')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {e}')
            )


