'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;
    if (session.user.status === 'PENDING') router.replace('/pendiente');
    else if (session.user.status === 'REJECTED') router.replace('/pendiente');
    else if (!session.user.hasPaid) router.replace('/pendiente');
    else router.replace(callbackUrl);
  }, [status, session, router, callbackUrl]);

  return (
    <div className="mx-auto mt-10 max-w-md card text-center">
      <div className="text-5xl">⚽</div>
      <h1 className="mt-2 text-2xl font-bold text-prode-green">Prode Mundial 2026</h1>
      <p className="mt-2 text-sm text-gray-600">
        Ingresá con tu cuenta de Google para participar.
      </p>
      <button
        className="btn-primary mt-6 w-full"
        onClick={() => signIn('google', { callbackUrl })}
      >
        <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
          <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.1 8.7 3.4l6.5-6.5C35.3 2.3 30 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.6 5.9C12.1 13.1 17.6 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.5 5.8c4.4-4.1 7.2-10.1 7.2-17.3z"/>
          <path fill="#FBBC05" d="M10.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.6-5.9C.9 17.5 0 20.6 0 24s.9 6.5 2.5 9.8l7.6-4.9z"/>
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.2-8.4 2.2-6.5 0-12-4.4-13.9-10.4l-7.6 5.9C6.5 42.6 14.6 48 24 48z"/>
        </svg>
        Ingresar con Google
      </button>
    </div>
  );
}
