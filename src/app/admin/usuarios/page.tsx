import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import UsersTable, { type AdminUser } from '@/components/admin/UsersTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsuariosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    redirect('/login');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  const adapted: AdminUser[] = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold text-prode-green sm:text-2xl">👥 Gestionar usuarios</h1>
        <p className="text-sm text-gray-600">
          Asignar y quitar privilegios de administrador.
        </p>
      </header>

      <UsersTable users={adapted} />
    </div>
  );
}
