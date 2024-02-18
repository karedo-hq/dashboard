import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { Awaitable, NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { AuthProfile } from '@/auth/lib/types/profile.types';
import { AuthTokens } from '@/auth/lib/types/tokens.types';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;

        const loginRes = await fetch(`${process.env.API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!loginRes.ok) {
          const resJSON = await loginRes.json();
          const errorMessage = resJSON.message;
          throw new Error(errorMessage);
        }

        const tokens: AuthTokens = await loginRes.json();

        const profileRes = await fetch(`${process.env.API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        if (profileRes.status !== 200) {
          throw new Error('Profil konnte nicht abgerufen werden.');
        }

        const profile: AuthProfile = await profileRes.json();

        const user = { user: profile, tokens } as unknown as Awaitable<User>;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }

      if (token.error === 'RefreshTokenExpired') {
        return token;
      }

      if (new Date().getTime() < token.tokens.expiresIn) {
        return token;
      }

      return await refreshToken(token);
    },
    async session({ session, token }) {
      session.user = token.user;
      session.tokens = token.tokens;

      if (token) {
        session.user = token.user;
        session.tokens = token.tokens;
        session.error = token.error;
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

async function refreshToken(token: JWT): Promise<JWT> {
  const refreshTokenRes = await fetch(`${process.env.API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token.tokens.refreshToken}`,
    },
  });

  if (refreshTokenRes.status === 401) {
    return {
      ...token,
      error: 'RefreshTokenExpired',
    };
  }

  const refreshedTokens = await refreshTokenRes.json();

  return {
    ...token,
    tokens: refreshedTokens,
  };
}

export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
