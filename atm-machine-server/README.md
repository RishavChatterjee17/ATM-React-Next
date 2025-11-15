# ATM Machine Server

ATM server ReST API (Express) server - handles authentication, user profile, and transactions with zod validation and error handling.

## Tech-Stack

- **Node.js 22.16.0** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Zod** - Runtime schema validation

## Features

- **Authentication** - PIN-based login with card type validation
- **User Profile** - Get and update user profiles
- **Balance Check** - Check account balances
- **Deposit** - Add funds to accounts with validation
- **Withdrawal** - Remove funds from accounts with balance checks
- **Transfer** - Transfer funds between accounts
- **Transaction History** - Retrieve transaction records
- **Input Validation** - Zod schema validation for all endpoints
- **Error Handling** - error responses

## Project Structure

```
atm-machine-server/
├── src/
│   ├── data/
│   │   └── store.ts           # Mock data store (users, transactions)
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── user.ts            # User profile routes
│   │   └── operations.ts      # Transaction routes
│   ├── schema/
│   │   ├── user.ts            # User type definitions
│   │   └── operations.ts      # Transaction type definitions
│   ├── utils/
│   │   └── helper.ts          # Helper functions
│   └── server.ts              # Express app and server setup - main entry file
├── dist/                      # Compiled JavaScript (generated)
├── package.json
└── tsconfig.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm package manager

### Installation

1. Navigate to the server directory:
```bash
cd atm-machine-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional) for environment variables:
```env
PORT=3001
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The server will start on port 3001 (or the port specified in `.env`).

## Available Scripts

- `npm run dev` - Start development server with hot reload (using tsx)
- `npm run build` - Compile TypeScript to JavaScript bundle
- `npm start` - Start production server (requires build first)

## API Endpoints

### Health Check

**GET** `/health`
- Returns server status
- Response: `{ status: 'ok', message: 'ATM Machine Server is running' }`

### Authentication

**POST** `/api/auth/login`
- Authenticate user with card type and PIN
- Request body:
  ```json
  {
    "cardType": "visa" | "mastercard",
    "pin": "1234"
  }
  ```
- Response: User object (without PIN) on success

### User Profile

**GET** `/api/user/profile`
- Get user profile information
- Headers: `x-user-id: <userId>` or Query: `?userId=<userId>`
- Response: User object (without PIN)

**PUT** `/api/user/profile`
- Update user profile
- Headers: `x-user-id: <userId>` or Query: `?userId=<userId>`
- Request body: User profile fields to update
- Response: Updated user object

### Transactions

**POST** `/api/transactions/deposit`
- Deposit funds into an account
- Headers: `x-user-id: <userId>` or Query: `?userId=<userId>`
- Request body:
  ```json
  {
    "accountId": "acc-1",
    "amount": 100
  }
  ```
- Response: Updated account and transaction record

**POST** `/api/transactions/withdraw`
- Withdraw funds from an account
- Headers: `x-user-id: <userId>` or Query: `?userId=<userId>`
- Request body:
  ```json
  {
    "accountId": "acc-1",
    "amount": 50
  }
  ```
- Response: Updated account and transaction record
- Error: Returns 400 if insufficient funds

**POST** `/api/transactions/transfer`
- Transfer funds between accounts
- Headers: `x-user-id: <userId>` or Query: `?userId=<userId>`
- Request body:
  ```json
  {
    "fromAccountId": "acc-1",
    "toAccountId": "acc-2",
    "amount": 25,
    "description": "Transfer description"
  }
  ```
- Response: Updated accounts and transaction record
- Error: Returns 400 if insufficient funds

**GET** `/api/transactions`
- Get transaction history for a user
- Headers: `x-user-id: <userId>` or Query: `?userId=<userId>`
- Optional query params: `?accountId=<accountId>` to filter by account
- Response: Array of transactions

## Storage

Currently, the server uses in-memory storage (`src/data/store.ts`). All data is reset when the server restarts. 
We can alternative store in a db for production quality work.

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] 
}
```
Success responses:
```json
{
  "success": true,
  "data": {} 
}
```
