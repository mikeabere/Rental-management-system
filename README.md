# Rental Property Management System

A production-minded MERN starter for Kenyan landlords and property managers. It includes JWT authentication, role-based authorization, property/unit/lease management, rent payment records, and M-Pesa Daraja STK Push integration.

## Features

- Multi-tenant-ready user model with `admin`, `manager`, and `tenant` roles.
- Property and unit inventory with occupancy status.
- Lease lifecycle with rent amount, deposit, dates, and tenant association.
- Rent payment initiation through Daraja M-Pesa Express (STK Push).
- Idempotent Daraja callback processing using `CheckoutRequestID`.
- Dashboard summary endpoints and responsive React UI.
- Security defaults: Helmet, CORS allowlist, rate limiting, bcrypt password hashing, JWT expiry, Zod request validation, centralized errors, and audit-friendly payment records.

## Requirements

- Node.js 20+
- MongoDB 6+
- Safaricom Daraja sandbox or production credentials
- A publicly reachable HTTPS callback URL for Daraja callbacks (use a tunnel such as ngrok locally)

## Setup

```bash
cp server/.env.example server/.env
npm install
npm run dev
```

The API runs on `http://localhost:5000` and the Vite client on `http://localhost:5173`.

## Daraja configuration

Set these values in `server/.env`:

- `MPESA_ENV=sandbox` or `production`
- `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`, `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL=https://your-domain.example/api/payments/mpesa/callback`
- `MPESA_TRANSACTION_TYPE=CustomerPayBillOnline` for a PayBill, or `CustomerBuyGoodsOnline` for a Till

The callback endpoint is intentionally public because Safaricom must call it. It validates the callback shape, persists the raw callback safely, and only marks a payment as completed when `ResultCode === 0`. Never trust the client to mark a payment paid.

## API overview

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a user |
| POST | `/api/auth/login` | Public | Issue JWT |
| GET | `/api/auth/me` | User | Current user |
| GET | `/api/dashboard/summary` | User | Portfolio summary |
| GET/POST | `/api/properties` | Manager | List/create properties |
| GET/POST | `/api/properties/:id/units` | Manager | List/create units |
| GET/POST | `/api/leases` | Manager | List/create leases |
| POST | `/api/payments/mpesa/stk-push` | Tenant/Manager | Start M-Pesa payment |
| GET | `/api/payments` | User | List own/managed payments |
| POST | `/api/payments/mpesa/callback` | Daraja | Receive callback |

## Production checklist

- Use a managed MongoDB deployment and enable backups.
- Set `JWT_SECRET` to a long random value and keep secrets in a secrets manager.
- Put the API behind TLS and a reverse proxy; use a fixed, allowlisted frontend origin.
- Add a job/queue for reconciliation and retrying transient Daraja failures.
- Add SMS/email receipts, document uploads, tenancy screening, and detailed audit logs as domain requirements evolve.
- Configure monitoring for callback failures and payment states stuck in `PENDING`.

## License

MIT