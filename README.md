# FixMate - Home Repair & Maintenance Service

FixMate is a premium home service booking platform. Customer can browse services, book a technician, pay by card, and track booking. Technician can accept and complete jobs. Admin can manage users, services and bookings.

Live Website: https://fixmate-client-virid.vercel.app
Live Server: https://fixmate-server-4w1b.onrender.com
Client Repo: https://github.com/pushpitadeveloper/fixmate-client
Server Repo: https://github.com/pushpitadeveloper/fixmate-server

## Test Accounts

> Tomar real test account alada hole ei 3 ta line change kore dao, tarpor commit dio.

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@fixmate.com | Admin123! |
| Technician | technician@fixmate.com | Tech123! |
| Customer | customer@fixmate.com | Customer123! |

Customer chaile Sign Up / Google Login diye notun account baniyeo test korte parbe.

## Features
- Home page with categories, how it works, why choose us
- Services page with search, filter, sort - 34 services in 7 categories
- Service details with slug URL - /services/laptop-battery-replacement
- Booking with date (past date blocked), time slot, problem description
- Secure card payment with Stripe - Cardholder Name, Card Number, Expiry, CVC
- Customer Dashboard - My Bookings, Cancel, Pay Now, Payment History, Profile
- Technician Dashboard - Add Service, Accept / Reject, Start, Completed
- Admin Dashboard - Manage Users, Approve Services, View Bookings & Revenue
- Profile with photo upload, name, email, phone, address
- About, Loading, Not Found, Error pages - Full English, Responsive

## Tech Stack
- Next.js 14, React, TypeScript, Tailwind CSS
- Better Auth - Google + Email login
- MongoDB + Express - Backend API
- Stripe - Card payment

## Run Locally
```bash
npm install
npm run dev
