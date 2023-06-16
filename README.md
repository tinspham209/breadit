# BREADIT

Fullstack Reddit Clone
<hr/>

## Tech-stack
- NextJS 13
- TypeScript
- TailwindCSS, radix-ui 
- Next-Auth
- Prisma
- Redis
- MySQL
- React Hook Form
- EditorJS

## Setup

1. Connect to DB
- Create an account and & db in [planetscale](planetscale.com)
- Get Connection and update `DATABASE_URL` to `.env`
- `yarn prisma db push`
- `yarn prisma generate`

2. Create Google ID & Google Client ID
- create new project in [Google Cloud](cloud.google.com)
- setup new credentials in OAuth2
- update `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` in `.env`

3. `NEXTAUTH_SECRET`
- access to https://generate-secret.vercel.app/32 to get the key
