@echo off
echo Starting MongoDB...

REM Create data directory if it doesn't exist
if not exist "D:\workplace\pushpak\webpage\backend\data\db" (
    mkdir "D:\workplace\pushpak\webpage\backend\data\db"
)

REM Start MongoDB
mongod --dbpath "D:\workplace\pushpak\webpage\backend\data\db"

pause