# FixMate - Client

FixMate is a home service booking platform. Customer service dekhte parbe, booking korte parbe, payment korte parbe. Technician kaj dekhte parbe, status update korte parbe. Admin service banate parbe, sob booking dekhte parbe.

## Features
- Home page, Services page, Service details
- Signup / Signin with BetterAuth
- Customer Dashboard - Amar bookings, Pay Now with Stripe
- Technician Dashboard - Assigned kaj, status update
- Admin Dashboard - Service create, sob booking dekha
- Stripe Payment - Test card diye payment
- Responsive - Mobile, Tablet, Desktop

## Tech
- Next.js 14.2.5 + TypeScript
- Tailwind CSS
- BetterAuth
- Stripe Checkout

## Run Locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Env - .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Test Accounts
- Customer: customer@test.com / 123456
- Technician: technician@test.com / 123456
- Admin: admin@test.com / 123456

## Test Card
- Card: 4242 4242 4242 4242
- Date: Future date
- CVC: 123

## Live Links
- Client:
- Server:
