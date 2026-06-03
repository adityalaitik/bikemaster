# MySQL Local Setup Guide

Setup MySQL locally (without Docker) for BikeMasters WMS development.

---

## macOS

### 1. Install MySQL via Homebrew

```bash
brew install mysql
```

### 2. Start MySQL service

```bash
brew services start mysql
```

### 3. Secure the installation & set root password

```bash
mysql_secure_installation
```

Follow the prompts — set root password to anything you like (e.g. `rootpassword`).

### 4. Log in as root

```bash
mysql -u root -p
```

### 5. Create the database and app user

```sql
CREATE DATABASE bikemaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bikemaster'@'localhost' IDENTIFIED BY 'bikemasterpassword';
GRANT ALL PRIVILEGES ON bikemaster.* TO 'bikemaster'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 6. Load the schema and seed data

```bash
mysql -u bikemaster -pbikemasterpassword bikemaster < db/schema/ddl_create.sql
mysql -u bikemaster -pbikemasterpassword bikemaster < db/dml/seed_data.sql
```

### 7. Update your `.env` file

```
DATABASE_URL=mysql://bikemaster:bikemasterpassword@localhost:3306/bikemaster
```

### 8. Run the app

```bash
npm run dev
```

---

## Windows

### 1. Download and install MySQL

1. Go to https://dev.mysql.com/downloads/installer/
2. Download **MySQL Installer (Windows)** — choose the full installer
3. Run the installer and select **Developer Default** setup type
4. Complete the wizard — when prompted, set the root password (e.g. `rootpassword`)
5. MySQL Server and MySQL Workbench will both be installed

### 2. Add MySQL to your PATH (if not done by installer)

1. Open **System Properties → Environment Variables**
2. Under **System Variables**, find `Path` and click **Edit**
3. Add the MySQL bin path, typically:
   ```
   C:\Program Files\MySQL\MySQL Server 8.0\bin
   ```
4. Click OK and restart your terminal

### 3. Start MySQL service

MySQL runs as a Windows service and starts automatically after install. To manage it manually:

```powershell
# Start
net start MySQL80

# Stop
net stop MySQL80
```

### 4. Log in as root

```powershell
mysql -u root -p
```

### 5. Create the database and app user

```sql
CREATE DATABASE bikemaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bikemaster'@'localhost' IDENTIFIED BY 'bikemasterpassword';
GRANT ALL PRIVILEGES ON bikemaster.* TO 'bikemaster'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 6. Load the schema and seed data

```powershell
mysql -u bikemaster -pbikemasterpassword bikemaster < db\schema\ddl_create.sql
mysql -u bikemaster -pbikemasterpassword bikemaster < db\dml\seed_data.sql
```

### 7. Update your `.env` file

```
DATABASE_URL=mysql://bikemaster:bikemasterpassword@localhost:3306/bikemaster
```

### 8. Run the app

```powershell
npm run dev
```

---

## Verify the connection

After the app is running, hit the API root to confirm it's up:

```bash
curl http://localhost:4000
```

And log in to get a JWT:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@bikemasters.in","password":"password123"}'
```

---

## Credentials reference

| Field     | Value                  |
|-----------|------------------------|
| Host      | `localhost`            |
| Port      | `3306`                 |
| Database  | `bikemaster`           |
| User      | `bikemaster`           |
| Password  | `bikemasterpassword`   |

---

## Troubleshooting

**`Access denied for user`** — Re-run step 5 and make sure `FLUSH PRIVILEGES` was executed.

**`Can't connect to MySQL server`** — MySQL service isn't running. On Mac: `brew services start mysql`. On Windows: `net start MySQL80`.

**`Table already exists`** — The schema was partially loaded. Run the rollback first, then re-apply:
```bash
mysql -u bikemaster -pbikemasterpassword bikemaster < db/schema/ddl_rollback.sql
mysql -u bikemaster -pbikemasterpassword bikemaster < db/schema/ddl_create.sql
```

**Port 3306 already in use** — Another MySQL instance is running. Stop it first or check with:
- Mac: `brew services list`
- Windows: `netstat -ano | findstr 3306`
