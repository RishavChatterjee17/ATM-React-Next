# ATM Web App

ATM Frontend App made using React/Next(App Router) - a hybrid of server and client components w/ server actions.

## Quick Note: User 1 (Rishav) Pin: 5555 | User 2 (Todd) Pin: 1234
- The card/user is randomly (50%) set on the home screen
- You can check which user is currently selected by checking the card (on the right)
- Hover on the card to see the details (the pin for the respective card is the last 4 digits)

## Tech-Stack

- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **schadcnUI + Radix UI** - Accessible component primitives
- **Zod** - Schema decalartion & validation
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Features

- **PIN Authentication** - Secure login with card type selection
- **Card Type Detection** - Visual indication of Visa/Mastercard
- **Balance Check** - View account balances across multiple accounts
- **Cash Withdrawal** - Withdraw funds from accounts
- **Cash Deposit** - Deposit funds into accounts
- **Transfer Funds** - Transfer money between accounts
- **Transaction History** - View past transactions
- **User Profile** - View and manage user profile information

## Project Structure

```
atm-machine-web-app/
├── app/                      # Next.js App Router pages
│   ├── actions/              # Server actions
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages (Server Components)
│   │   ├── account/          # Account management
│   │   ├── deposit/          # Deposit page
│   │   ├── transactions/     # Transactions page
│   │   ├── transfer/         # Transfer page
│   │   └── withdraw/         # Withdraw page
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components (Client Components)
│   ├── Dashboard/            # Dashboard components
│   ├── Home/                 # Home page components
│   ├── Login/                # Login components
│   ├── PaymentCard/          # Card display components
│   └── ui/                   # Reusable UI components
├── helpers/                  
│   └── Transition/           # Page transition utilities
├── hooks/                    # Custom React hooks
├── lib/                      
│   ├── api.ts                # API client
│   ├── auth.ts               # Authentication utilities
│   ├── features/             # Redux slices
│   ├── schemas/              # Zod schemas
│   └── store.ts              # Redux store configuration
└── public/                   # Static assets
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd atm-machine-web-app
```

2. Install dependencies:
```bash
npm install
```

1. Create a `.env` file (optional) for environment variables:
```env
API_URL='http://localhost:3001' (private)
NEXT_PUBLIC_API_URL=http://localhost:3001 (public)
```

1. Start the development server:
```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production bundle
- `npm start` - Start production server

## Backend Integration

This frontend connects to the `atm-machine-server` backend API. Make sure the backend server is running on port 3001 (default) before using the application.

### API Configuration

The frontend communicates with the backend using:
- Base URL: `http://localhost:3001/api`
- Authentication: Custom header `x-user-id` (set after login)
- Endpoints:
  - `/api/auth/login` - User authentication
  - `/api/user/profile` - User profile operations
  - `/api/transactions/*` - Transaction operations

## Usage

1. **Login**: 
   - Select a card type (Visa or Mastercard)
   - Enter your 4-digit PIN
   - Test users:
     - Visa card: PIN `5555` (User: Rishav)
     - Mastercard: PIN `1234` (User: Todd)

2. **Dashboard**:
   - View account balances
   - Access transaction options

3. **Transactions**:
   - **Withdraw**: Remove funds from an account
   - **Deposit**: Add funds to an account
   - **Transfer**: Move funds between accounts
   - **Transactions**: View transaction history

4. **Profile**:
   - View user information
   - Update profile details


