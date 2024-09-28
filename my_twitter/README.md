# Web Programming HW#3

請依照順序執行！感恩～

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

## about HW2

### 除 "作業內容（Pass）" 額外的功能

- 不直觀的 作業內容（Pass）

  1. 一進網站就會有default使用者名稱叫 "使用者名稱"，可透過切換使用者更改使用者。
  2.

- 進階要求(Perfect)

  有完成

### limitation

1. 開啟網站後請等待一下，他產生預設使用者名稱。(@null->@使用者名稱)
2. 新增活動後會要等幾秒才會跳到該活動瀏覽頁面，請耐心等待感恩！
3. 點選各個小時按太快的話 db 會來不及新增，慢慢點比較好。
