import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';

async function promoteAdminIfNeeded(userId: string | undefined, email: string | null | undefined) {
  if (!userId || !email) return;
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!adminEmail || email.toLowerCase() !== adminEmail) return;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  if (!user?.isAdmin) {
    await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: true, status: 'APPROVED', hasPaid: true },
    });
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  session: { strategy: 'database' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (!session.user) return session;
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          status: true,
          hasPaid: true,
          isAdmin: true,
        },
      });
      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.email = dbUser.email;
        session.user.name = dbUser.name;
        session.user.image = dbUser.image;
        session.user.status = dbUser.status;
        session.user.hasPaid = dbUser.hasPaid;
        session.user.isAdmin = dbUser.isAdmin;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await promoteAdminIfNeeded(user.id, user.email);
    },
    async signIn({ user }) {
      await promoteAdminIfNeeded(user.id, user.email);
    },
  },
  pages: {
    signIn: '/login',
  },
};
