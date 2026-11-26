# FixMate - Client

Live repair service booking platform. Customers can browse services, book a repair, pay online, and track booking status. Technicians can accept and complete jobs. Admins can manage users, approve or reject services, and view bookings and revenue.

**Live Client:** https://fixmate-client-virid.vercel.app
**Live Server:** https://fixmate-server-4w1b.onrender.com

## Features

- Browse services by category, search, sort by price and newest
- Service detail page with slug URL, for example `/services/laptop-battery-replacement`
- Booking with date, time slot, address, phone and problem description, past dates blocked
- Booking fields auto-filled from profile, all fields editable
- Card payment with cardholder name, card number, expiry and CVC, all empty for user to enter
- Customer dashboard - bookings, payment status, cancel booking
- Technician dashboard - accept, complete jobs, view assigned bookings
- Admin dashboard - manage users, create service, approve or reject service, view bookings and transactions
- Role based redirect after login - customer, technician, admin
- Email and Google login
- Profile page with editable name, phone and address

## Tech Stack

- Next.js 15, React, TypeScript, Tailwind CSS
- Better Auth for authentication
- Sonner for toast
- Vercel for deployment

## Test Accounts

Use these accounts to test the live site. Do not change their passwords.

| Role | Email | Password |
| --- | --- | --- |
| Admin | testadmin@gmail.com | Admin123! |
| Technician | testtech@gmail.com | Tech123! |
| Customer | testlive456@gmail.com | Admin123! |

## How To Test

1. Login as Customer, open any service, click Book Now, fill the form and pay with any test card.
2. Login as Technician, open Technician Dashboard, accept a booking, then mark it complete.
3. Login as Admin, open Admin Dashboard, go to Services tab, create a new service, approve or reject a pending service.
4. In Admin Dashboard, go to Users tab, change a user role from Customer to Technician.

## Run Locally

```bash
git clone <client-repo-url>
cd fixmate-client
npm install
```

Create `.env.local` in the client root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Then run:

```bash
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

## Folder Structure

```text
src/
  app/
    dashboard/
      admin/
      customer/
      technician/
    services/
    booking/
    profile/
    sign-in/
    sign-up/
  components/
  lib/
```

## Notes

- Service URLs use slug, not demo IDs.
- Payment page does not store card data.
- Admin Approve and Reject work from the dashboard, no database manual change needed.
