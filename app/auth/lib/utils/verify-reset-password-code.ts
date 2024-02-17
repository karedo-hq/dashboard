import jwt, { JwtPayload } from 'jsonwebtoken';

export function verifyResetPasswordCode(token: string) {
  try {
    const secretKey = process.env.JWT_RESET_PASSWORD_SECRET!;
    const decoded = jwt.verify(token, secretKey);
    return decoded as JwtPayload & { _id: string; email: string };
  } catch {
    return null;
  }
}
