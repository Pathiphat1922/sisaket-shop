import NextAuth, { type NextAuthOptions, type Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { User } from 'next-auth';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Credentials Provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          console.log('Login attempt:', credentials.email);

          // ตรวจสอบจาก global.users (จากการสมัครสมาชิก)
          if (!(global as any).users) {
            (global as any).users = [];
          }

          const user = ((global as any).users as any[]).find(
            (u: any) => u.email === credentials.email
          );

          // Demo account สำหรับทดสอบ
          if (!user && credentials.email === 'test@example.com' && credentials.password === 'password') {
            console.log('Demo account login success');
            return {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              image: null
            };
          }

          if (!user) {
            console.log('User not found:', credentials.email);
            throw new Error('Invalid email or password');
          }

          // ตรวจสอบ password ด้วย bcryptjs
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log('Password mismatch for:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('Login success for:', credentials.email);

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            image: null
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production',
  debug: process.env.NODE_ENV === 'development',
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };