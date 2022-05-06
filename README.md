# User Identity System API
 
 Service to securely register users, identify users based on login information and password, authorize accessability to routes based on roles of the user, and authenticate the user based on a JWT.

## Workflows:

The following endpoints are provided for users using this identity system.
* Signup
* Login
* Logout
* Update user information
* Reset password
* Forget password
* Delete account
* Get all users/ the current user/ the user by user ID
* Refresh current token
* Revoke token

More TODO applications:
* Two-Factor authentication
* Email verification
* Third-Party sign on (Oauth 2.0)
* SSO
* Login/Signup frontend

## How to use

### Dependencies

```
npm install
```

### Configuration

Copy the default `.env.default` to `.env` and modify as needed.

```
## REQUIRED
DB_HOST = foo

## OPTIONAL
# Database User Info
DB_PASSWORD=12345678
DB_USER=newuser
# isten port of the bot
PORT=3000
```

### API's available

#### Login
  Log in a user by his username or Email as the login info and his password.
  
  POST /users/login
  
Request body:
```json
{
  "loginInfo": "foobar",
  "password": "password"
}
```
Successful validation response:
```json
{
    "isVerified": false,
    "id": "8cb51257-fe30-451c-b033-1f718e44a531",
    "username": "foobar",
    "email": "foobar@email.com",
    "firstName": "foo",
    "lastName": "bar",
    "role": "Admin",
    "verificationToken": "7b9d22b60a97349ede97dfaa8af127b9fa6cf9e25fc8a82b73dad2469d38857ea83b4703212b28e0",
    "verified": null,
    "resetToken": null,
    "resetTokenExpires": null,
    "createdAt": "2022-05-05T15:21:48.000Z",
    "updatedAt": "2022-05-05T15:21:48.000Z",
    "token":    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiOGNiNTEyNTctZmUzMC00NTFjLWIwMzMtMWY3MThlNDRhNTMxIiwiaWF0IjoxNjUxNzg2Mjc0LCJleHAiOjE2NTE3ODcxNzR9.-P6w6CaLnROtaKoq4T46Ca7msB_a0q4cbR_uPp2H-LE"
}
```
