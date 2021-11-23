# Node.JS JWT Authentication Service

A simple NodeJS REST API application with user registration, email activation, login and JWT authentications. 

This application uses `MongoDB` as its database.

This application uses `express, mongoose, jsonwebtoken, bcrypt, nodemailer` packages. 

<br>
<br>

## File Structure

```bash
./
├── config
│   └── database.js
├── controllers
│   └── authController.js
│   └── pageController.js
├── middlewares
│   └── authMiddleware.js
├── models
│   └── Confirmation.js
│   └── User.js
├── modules
│   └── extensions.js
├── routes
│   └── authRoute.js
│   └── pageRoute.js
├── middleware
│   └── authentication.js
├── app.js
└── .env
```

<br>
<br>

## Installation

1.  Clone the project.
```sh
$ git clone https://github.com/yrtby/jwt-nodejs-authentication.git
```
2. Install dependencies
```sh
$ npm install
```
3. Run the API server
```sh
$ npm start  ( or node app.js )
```

<br>
<br>

## Usage

1. Create `.env` file 
2. Make settings
```
ENV_DOMAIN = "localhost"
ENV_PORT = 5000

ENV_CONNECTION_STRING = <connection-string>         -> example "mongodb://localhost/<node-api>"
ENV_SMTP_HOST = <address>                           -> example "smtp.gmail.com"
ENV_SMTP_PORT = <port>                              -> example "465"
ENV_SMTP_SECURE = <true || false>                   -> example "true"
ENV_SENDER_MAIL_ADDRESS = <sender-mail>             -> example "abcdef123@gmail.com"
ENV_SENDER_MAIL_PASSWORD = <sender-mail-password>   -> example "123456789"
ENV_JWT_TOKEN_KEY = <sercet-token-key>              -> example "qwe123asd123zxc"
ENV_JWT_EXPIRED_TIME = <token-expired-time>         -> example "2h"
```

<br>
<br>

### Register
1. Using POSTMAN, Set the header `Content-type` to `application/json`
2. Access `http://localhost:<port>/auth/register` via `POST`

```json
{
    "first_name":"Anılcan",
    "last_name":"Yurtbay",
    "email":"a2.yurtbay@gmail.com",
    "password":"123456"
}
```

3. Response

```json
{
    "status": "success",
    "message": "user created, check your email for activation"
}
```
<br>
<br>

### Activation
1. Click email activation link OR Using POSTMAN, Set the params `token` 
2. Access `http://localhost:<port>/auth/activate` via `GET`

<br>

![img](./screenshots/github-node-at.jpg)

<br>

3. Response

```json
{
    "status": "success",
    "message": "activation success"
}
```

<br>
<br>


### Submit again if activation time has expired. 
1. Using POSTMAN, Set the header `Content-type` to `application/json`
2. Access `http://localhost:<port>/auth/resend` via `POST`

```json
{
    "email":"a2.yurtbay@gmail.com"
}
```

3. Response

```json
{
    "status": "success",
    "message": "activation email has been sent again, check your email for activation"
}
```
<br>
<br>

### Login
1. Using POSTMAN, Set the header `Content-type` to `application/json`
2. Access `http://localhost:<port>/auth/login` via `POST`

```json
{
    "email":"a2.yurtbay@gmail.com",
    "password":"123456"
}
```

3. Response

```json
{
    "status": "success",
    "message": "login success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE5Y2M4YmExZjkzNmJmODY1MWZkOWE4IiwiZW1haWwiOiJhMi55dXJ0YmF5QGdtYWlsLmNvbSIsImlhdCI6MTYzNzY2NzAyMiwiZXhwIjoxNjM3Njc0MjIyfQ.Ap1NcPtKZz_J3WctoC_eaSPgG_CFNdkWnjdjqrcByZ4"
}
```
<br>
<br>


### CHECK AUTHORIZATION
1. Using POSTMAN, Set the authorization `Bearer Token`
2. Access `http://localhost:<port>/` via `GET`
3. Response

```json
{
    "status": "success",
    "message": "welcome index page"
}
```
<br>
<br>