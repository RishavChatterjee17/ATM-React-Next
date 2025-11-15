// middleware/proxy for the server api call. Added this file to show how we can hide the server api from the client if needed for better security.

import { NextResponse } from 'next/server';
import type { HealthCheckResponse } from '@/lib/schemas/types';

const EXTERNAL_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// this fucntion will run when GET /api/health is called by the client side api route api.ts
export async function GET() {
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Health check failed' },
        { status: response.status }
      );
    }

    const data: HealthCheckResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Health check route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to check server health';
    
    return NextResponse.json(
      { status: 'error', message: errorMessage },
      { status: 500 }
    );
  }
}

