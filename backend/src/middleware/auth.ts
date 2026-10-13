import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'smart-clinic-super-secure-jwt-key-2026-prod-grade';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPERADMIN' | 'CLINIC_ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';
  clinicId?: string | null;
  doctorProfileId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    if (req.user.role === 'SUPERADMIN') {
      return next(); // Superadmin can access everything
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires one of [${allowedRoles.join(', ')}] role` });
    }

    next();
  };
}

export function getTenantClinicId(req: Request): string {
  if (req.user?.role === 'SUPERADMIN') {
    // If superadmin provided ?clinicId= query, respect it, else return first or empty
    const queryClinicId = req.query.clinicId as string;
    return queryClinicId || req.user.clinicId || '';
  }
  return req.user?.clinicId || '';
}
