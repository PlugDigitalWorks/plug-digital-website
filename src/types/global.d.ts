import 'next';
import 'next/server';
import { JWTPayload } from 'jose';
import { AdminRole } from '@prisma/client';

// Cloudflare Pages Function types
declare global {
  interface PagesFunction<Env = unknown> {
    (context: {
      request: Request;
      env: Env;
      params: Record<string, string>;
      waitUntil: (promise: Promise<any>) => void;
      next: (input?: RequestInfo, init?: RequestInit) => Promise<Response>;
      data: Record<string, unknown>;
    }): Response | Promise<Response>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    dump(): Promise<ArrayBuffer>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1ExecResult>;
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run(): Promise<D1Result>;
    all<T = unknown>(): Promise<D1Result<T>>;
    raw<T = unknown>(): Promise<T[]>;
  }

  interface D1Result<T = unknown> {
    results?: T[];
    success: boolean;
    error?: string;
    meta: {
      changes: number;
      last_row_id: number;
      rows_read: number;
      rows_written: number;
    };
  }

  interface D1ExecResult {
    count: number;
    duration: number;
  }
}

// Define a common UserSession type
export interface AdminSession extends JWTPayload {
  id: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  iat: number;
  exp: number;
}

// Extend NextRequest & NextApiRequest to include session
declare module 'next' {
  interface NextApiRequest {
    admin?: AdminSession; // Attach admin session to NextApiRequest
  }
}

declare module 'next/server' {
  interface NextRequest {
    admin?: AdminSession; // Attach admin session to NextRequest (Middleware)
  }
}
