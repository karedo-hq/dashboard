import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      email: string;
      firstname?: string;
      lastname?: string;
      avatar?: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    error?: 'RefreshTokenExpired';
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      _id: string;
      email: string;
      firstname?: string;
      lastname?: string;
      avatar?: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    error?: 'RefreshTokenExpired';
  }
}
