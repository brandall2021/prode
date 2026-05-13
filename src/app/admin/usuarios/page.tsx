import { prisma } from '@/lib/prisma';
import UsersTable, { type AdminUser } from '@/components/admin/UsersTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      status: true,
      hasPaid: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  const adapted: AdminUser[] = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-prode-green sm:text-2xl">👥 Usuarios</h1>
      <UsersTable users={adapted} />
    </div>
  );
}
