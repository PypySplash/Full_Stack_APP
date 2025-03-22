# Web Programming #3

Please follow these steps in order! Thank you!

### 1. add `.env.local`

Create a `.env.local` file in the root of the project and add a _valid_ Postgres URL. To get a Postgres URL, follow the instructions [here](https://ric2k1.notion.site/Free-postgresql-tutorial-f99605d5c5104acc99b9edf9ab649199?pvs=4).

This is just an example, you should replace the URL with your own.

```bash
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/twitter"
```

### 2. install dependencies

```bash
yarn install
```

### 4. run the migrations

```bash
docker compose up -d
yarn migrate
```

### 5. Start the app

```bash
yarn dev
```

### 6. Linting

```bash
yarn lint
```

