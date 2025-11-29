@echo off
echo ========================================
echo Creating Django Superuser
echo ========================================
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Run the Python script
python create_superuser_simple.py

echo.
echo ========================================
echo Done! Check output above.
echo ========================================
pause

