# About

This project is a combinisation between:

- Express
- Posgtres
- Prisma as an ORM
- JWT Auth (accessToekn & refreshToken)
- Roles Guard (
  1 SUPERADMIN
  2 ADMIN
  3 STAFF
  4 CLIENT
  6 TECHNICAL_MANAGER
  )

- Docker
- Docker compose

<br>
<br>

# Migration

- Create migration called init :

```
npx prisma migrate dev --name "init"
```

- Deploy migrations to DB :

```
npx prisma migrate deploy
```

- Upload seeds dummies data to DB :

```
npx prisma db seed
```

<br>
<br>

# Run Development environment:

```
docker-compose up --build
```

<br>
<br>

<br>
<br>

# If you are using windows and docker desktop:

- Change in .env POSTGRES_HOST=localhost
- Remove api container from docker-compose.yaml
- Run docker-compose up --build
- Open new terminal
- Run npx prisma migrate dev
- Run npx prisma db seed
- Run npm run start:dev
