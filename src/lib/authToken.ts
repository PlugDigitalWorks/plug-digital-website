/* import { AdminRole } from '@prisma/client'; */
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Set in .env
const encoder = new TextEncoder();
const secretKeyUint8Array = encoder.encode(SECRET_KEY);

// ✅ Generate JWT Token (Edge-compatible)
export const generateToken = async (user: {
  id: string;
  email: string;
  name: string;
  role: string;
}) => {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' }) // HMAC SHA-256
    .setIssuedAt()
    .setExpirationTime('1d') // Token expires in 1 day
    .sign(secretKeyUint8Array);
};

// ✅ Verify JWT Token (Edge-compatible)
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secretKeyUint8Array, {
      algorithms: ['HS256'],
    });
    return payload as {
      id: string;
      email: string;
      /* role: AdminRole; */
      name: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    return null;
  }
};
