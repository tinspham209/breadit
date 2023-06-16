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
- MySQL / PlanetScale
- React-Query
- React-Hook-Form
- EditorJS
- date-fns

## Setup

1. Connect to DB MySQL/PlanetScale
- Install `planetscale-cli`
  - https://github.com/planetscale/cli#windows
- Create an account and & db in [planetscale](planetscale.com)
- Get Connection with Prisma type and update `DATABASE_URL` to `.env`
- Run these cmd
```
pscale auth login
yarn prisma generate
yarn prisma db push
```

2. Create Google ID & Google Client ID
- create new project in [Google Cloud](cloud.google.com)
- setup new credentials in OAuth2
- update `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` in `.env`

3. `NEXTAUTH_SECRET`
- access to https://generate-secret.vercel.app/32 to get the key

4. Install dependencies
```
yarn
```

5. Run project
```
yarn dev
```
