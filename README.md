
# JWT Refresh Token Implementation

## Overview

JWT Refresh Token Implementation merupakan implementasi pribadi saya sebagai author dalam penggunakan JWT (JSON Web Token). Pada dasarnya, token JWT bisa aktif selamanya. Namun, untuk meningkatkan sekuritas dalam operasi yang terjadi maka token JWT bisa ditentukan masa aktifnya sehingga token JWT akan expired apabila melebihi masa aktifnya. Lalu untuk memperbarui token JWT dibutuhkan Refresh Token yang disimpan pada database setiap kali user melakukan login dan akan dihapus apabila user logout. 

## Procedure

Terdapat database dengan tabel User yang berisikan beberapa kolom seperti ID (UUID), Username, Password, Refresh Token. User dapat melakukan login yang mana server akan mengembalikan ACCESS_TOKEN dan menyimpan REFRESH_TOKEN pada tabel. ACCESS_TOKEN tersebut bisa digunakan ketika melakukan operasi whoAmI (Terdapat pada bagian API Reference). Namun, ACESS_TOKEN tersebut hanya akan aktif selama 30 menit dan akan expired setelahnya. Untuk *generate* ACCESS_TOKEN, bisa melakukan operasi updateToken (Terdapat pada bagian API Reference). Dalam operasi tersebut dibutuhkan data pada *request body* dengan nama parameter **token** yang berisikan REFRESH_TOKEN. REFRESH_TOKEN ini akan diverifikasi oleh JWT dan apabila valid maka akan mengembalikan respon berisikan ACCESS_TOKEN yang baru.

**Notes**

Refresh Token ini hanya digunakan referensi ketika akan melakukan generate access token baru sehingga Refresh Token tidak akan bisa digunakan sebagai Access Token.




## API Reference

**Register**
```https
POST http://localhost:8000/register
```
**Login**
```https
POST http://localhost:8000/login
```
**WhoAmI**
```https
GET http://localhost:8000/me
```
**Update Token**
```https
POST http://localhost:8000/refresh
```
**Logout**
```https
POST http://localhost:8000/logout
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/SatrioBayu/node-express-refresh-token.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```


## Environment Variables

Untuk menjalankan project ini, Perlu untuk menambahkan environment variable ke file .env Anda

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

`PGDATABASE`

`PGHOST`

`PGPASSWORD`

`PGPORT`

`PGUSER`

Atau juga bisa dilakukan set manual pada file config/database.js

## Tech Stack

- [Node JS](https://nodejs.org/en)
- [Express](http://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://github.com/auth0/node-jsonwebtoken#readme)

## Dokumentasi API

Dokumentasi API masih dalam pengerjaan. Rencananya dokumentasi API akan menggunakan Swagger
