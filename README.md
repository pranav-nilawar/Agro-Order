
#  AgriOrder - Bulk Vegetable/Fruit Ordering Web App

A full-stack web application to simplify the process of placing and managing bulk vegetable and fruit orders. Buyers can browse products and place orders, while admins can manage inventory and track order statuses.



## Features

###  Buyers
- Browse a catalogue of fresh produce
- Add multiple products and quantities
- Submit bulk orders with delivery details
- Track order status in real time

###  Admins
- Add, edit, or delete products
- View and manage all incoming orders
- Update order statuses: Pending → In Progress → Delivered


## Steps to Test & Run Web App

### Step 1: Install PostgreSQL on Windows
    1. Go to https://www.postgresql.org/download/windows/
    2. Click the "Download the installer" button (hosted by EDB).
    3. Run the installer:
        Install PostgreSQL, pgAdmin (optional), and command line tools.
        Choose a password for the postgres superuser (store it securely).
        Leave port as 5432.

### Step 2: Add to PATH
    Ensure PostgreSQL’s bin folder is in your system’s PATH:
    For Eg, C:\Program Files\PostgreSQL\15\bin

### Step 3: Update your .env file 
    DATABASE_URL="postgresql://postgres:<your-password>@localhost:5432/mydb"

### Step 4: Install all dependencies
    1. For Frontend:
        cd agri-order
        npm install tailwindcss postcss autoprefixer prisma @prisma/client axios react-hook-form zod
        npx prisma init

    2. For Backend:
        cd agri-order-server
        npm init -y
        npm install express cors pg prisma
        npx prisma init
        npx prisma migrate dev --name init
        npx prisma generate

### Step 5: Run Everything
    Backend: 
        cd agri-order-server 
        node index.js
    Frontend: 
        cd agri-order 
        npm run build
        npm start






##  Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Frontend     | React.js (with Tailwind CSS)  |
| Backend      | Node.js + Express             |
| Database     | PostgreSQL                    |
| ORM          | Prisma                        |
| API Requests | Axios                         |
| Validation   | Zod + react-hook-form         |
| Deployment   | Vercel (Frontend), Railway/Render (Backend + DB) |