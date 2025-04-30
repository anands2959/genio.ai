import NextAuth, { DefaultSession, Session, Account, SessionStrategy } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

type ExtendedSession = DefaultSession & {
  user: {
    provider?: string;
  } & DefaultSession['user'];
};

import { JWT } from 'next-auth/jwt';

type ExtendedToken = JWT & {
  provider?: string;
  accessToken?: string;
};

export const authOptions = {
  
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email first');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user: any; account: Account | null }): Promise<ExtendedToken> {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          provider: account.provider,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<ExtendedSession> {
      // Fetch user from database to get latest profile picture
      const user = await prisma.user.findUnique({
        where: { email: session.user.email! }
      });
      
      return {
        ...session,
        user: {
          ...session.user,
          provider: token.provider,
          image: user?.profilePicture || session.user.image,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };