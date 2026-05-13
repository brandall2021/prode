# Prode Mundial 2026

Aplicación de prode para el Mundial 2026, construida con Next.js 14 (App Router) + Tailwind + Prisma + PostgreSQL externo + NextAuth (Google OAuth). Pensada para deploy con **Dokploy** en `panel.softgroup.com.ar`.

## Stack

- Next.js 14 (App Router, `output: standalone`)
- Tailwind CSS
- Prisma ORM
- PostgreSQL externo (`panel.softgroup.com.ar:25478`)
- NextAuth con Google Provider y sesiones en base de datos
- TypeScript

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```
DATABASE_URL=postgresql://USER:PASSWORD@panel.softgroup.com.ar:25478/prode_mundial_2026?schema=public
NEXTAUTH_URL=https://prode.softgroup.com.ar
NEXTAUTH_SECRET=<openssl rand -base64 32>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAIL=cpereyra@face.unt.edu.ar
```

El email definido en `ADMIN_EMAIL` se promueve automáticamente a admin la primera vez que ingresa con Google (queda aprobado e `isAdmin = true`).

## Google OAuth

En Google Cloud Console → APIs & Services → Credentials → OAuth 2.0:

- **Authorized JavaScript origins:** `https://prode.softgroup.com.ar`
- **Authorized redirect URIs:** `https://prode.softgroup.com.ar/api/auth/callback/google`

Para desarrollo local agregar también `http://localhost:3000` y `http://localhost:3000/api/auth/callback/google`.

## Desarrollo local

```bash
npm install
cp .env.example .env  # completar valores
npx prisma migrate dev --name init
npm run db:seed       # carga los 72 partidos de fase de grupos
npm run dev
```

## Comandos útiles

- `npm run db:push` — sincroniza schema sin generar migración
- `npx prisma migrate deploy` — aplica migraciones en producción
- `npm run db:seed` — carga partidos del fixture

## Reglas del juego

- Login: solo Google OAuth.
- Cada usuario nuevo queda `PENDING`. El admin lo aprueba.
- Cuota: $20.000 ARS. El admin confirma manualmente el pago.
- Pozo: cantidad de pagos × $20.000. Premio = 70%, organización = 30%.
- Picks: resultado exacto por partido, editables hasta 90 minutos antes del partido.
- Puntos: exacto = 3, ganador acertado = 1, fallado = 0.

## Deploy con Dokploy

1. **Crear base de datos** `prode_mundial_2026` en el servidor PostgreSQL de `panel.softgroup.com.ar:25478`.
2. **Subir el repo** al control de versiones que use Dokploy (Git).
3. **Crear servicio "Application" en Dokploy** apuntando al repo, con build type **Dockerfile** (el `Dockerfile` está en la raíz).
4. **Variables de entorno** en Dokploy (todas las del `.env.example`).
5. **Dominio**: configurar `prode.softgroup.com.ar` con SSL.
6. **Pre-deploy / primer arranque**: correr una sola vez en el contenedor:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```
   Esto puede hacerse desde la pestaña "Shell" de Dokploy una vez levantado el container, o como **post-deploy command**:
   ```
   npx prisma migrate deploy && npx tsx prisma/seed.ts
   ```

## Primer login

1. Ingresar con la cuenta de Google cuyo email coincida con `ADMIN_EMAIL`.
2. El sistema te promueve automáticamente a admin aprobado.
3. Desde `/admin/usuarios` aprobar el resto de los usuarios y confirmar sus pagos.

## Estructura

```
src/
  app/
    page.tsx              Leaderboard + Pozo (público)
    login/                Login Google
    pendiente/            Pantalla de espera
    picks/                Carga de picks (participante)
    mis-picks/            Resumen personal (participante)
    admin/                Panel admin (layout + páginas)
    api/
      auth/[...nextauth]  NextAuth
      picks               POST pick
      admin/users         PATCH (aprobar, pagar, admin, etc.)
      admin/results       POST resultado + recálculo
  components/             Navbar, Footer, PickRow, admin/*
  lib/
    auth.ts               NextAuthOptions
    prisma.ts             Cliente Prisma
    scoring.ts            calculatePoints(pick, result)
    pozo.ts               getPozo() + formatARS
    timezone.ts           UTC-3 + isLocked (90 min)
  middleware.ts           protege /picks /mis-picks /admin
prisma/
  schema.prisma           User, Match, Pick, Payment + tablas NextAuth
  seed.ts                 72 partidos fase de grupos
```
