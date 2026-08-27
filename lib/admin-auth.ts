import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as admin from 'firebase-admin';

export interface AuthUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

const ADMIN_EMAILS = [
  'adnaryama1@gmail.com',
  'yusufadi5525@gmail.com',
  'mahdanurauliya@gmail.com',
  'berlianapm27@gmail.com',
  'yosawulandari16@gmail.com',
];

let adminApp: any = null;

function getAdminApp(): any {
  if (!adminApp) {
    try {
      const apps = (admin as any).apps || [];
      adminApp = apps.length > 0
        ? apps[0]
        : (admin as any).initializeApp({ credential: (admin as any).credential.applicationDefault() });
    } catch {
      // Fallback: try with default cert
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        adminApp = (admin as any).initializeApp(
          { credential: (admin as any).credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) },
          'admin-api'
        );
      } else {
        adminApp = (admin as any).initializeApp({ credential: (admin as any).credential.applicationDefault() }, 'admin-api');
      }
    }
  }
  return adminApp;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const headerStore = await headers();
  const authHeader = headerStore.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  try {
    const app = getAdminApp();
    const token = authHeader.slice(7);
    const decoded = await app.auth().verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      isAdmin: ADMIN_EMAILS.some(e => e.toLowerCase() === (decoded.email ?? '').toLowerCase()),
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as any;
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as any;
  }
  if (!user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 }) as any;
  }
  return user;
}
