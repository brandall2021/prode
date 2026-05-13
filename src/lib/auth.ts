import type { Adapter, AdapterUser, AdapterAccount, AdapterSession } from 'next-auth/adapters';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';

// Adapter manual — omite emailVerified para compatibilidad con Prisma client cacheado
const adapter: Adapter = {
  createUser: (data: Omit<AdapterUser, 'id'>) =>
    prisma.user.create({
      data: { email: data.email, name: data.name ?? null, image: data.image ?? null },
    }) as any,

  getUser: (id: string) => prisma.user.findUnique({ where: { id } }) as any,

  getUserByEmail: (email: string) => prisma.user.findUnique({ where: { email } }) as any,

  getUserByAccount: async ({ provider, providerAccountId }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>) => {
    const acc = await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: { user: true },
    });
    return (acc?.user ?? null) as any;
  },

  updateUser: ({ id, ...data }: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) =>
    prisma.user.update({ where: { id }, data }) as any,

  deleteUser: (id: string) => prisma.user.delete({ where: { id } }) as any,

  linkAccount: (data: AdapterAccount) =>
    prisma.account.create({ data: data as any }) as any,

  unlinkAccount: ({ provider, providerAccountId }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>) =>
    prisma.account.delete({
      where: { provider_providerAccountId: { provider, providerAccountId } },
    }) as any,

  createSession: (data: { sessionToken: string; userId: string; expires: Date }) =>
    prisma.session.create({ data }),

  getSessionAndUser: async (sessionToken: string) => {
    const result = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!result) return null;
    const { user, ...session } = result;
    return { session, user: user as any };
  },

  updateSession: (data: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>) =>
    prisma.session.update({ where: { sessionToken: data.sessionToken }, data }) as any,

  deleteSession: (sessionToken: string) =>
    prisma.session.delete({ where: { sessionToken } }) as any,
};

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
  adapter,
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
        select: { id: true, email: true, name: true, image: true, status: true, hasPaid: true, isAdmin: true },
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
  pages: { signIn: '/login' },
};
