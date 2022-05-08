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

### Running

```
npm start
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
Failed validation, in case login or password was incorrect:

```json
{
    "message": "User login info or password is incorrect"
}
```

---
#### Sign up
  Register a user with his user information. The first registered user will be assign Admin role.
  
  POST /users/sign-up
  
Request body:
```json
{
    "username": "foo",
    "email": "foobar@email.com",
    "password": "12345678",
    "confirmPassword": "12345678",
    "firstName": "foo",
    "lastName": "bar",
    "acceptTerms": true
}
```
Successful register response:
```json
{ message: "Sign up successfully" }
```

Error will be threw if:

1. username or email already exists in the database
2. sign up schema does not meet

#### Refresh token
  Replace an old refresh token stored in cookies with a new one, the refresh token is used for generating new JWT access tokens when (or just before) they expire.
  
  POST /users/refresh-token
  
Request body:
```json
{
}
```

#### Revoke token
  Revoke a token stored in cookie by user, or revoke a specified token in the req body by admin only.
  
  POST /users/revoke-token
  
Request body (optional):
```json
{
  "token": "7b9d22b60a97349ede97dfaa8af127b9fa6cf9e25fc8a82b73dad2469d38857ea83b4703212b28e0"
}
```
Successful response:
```json
{
    message: "Token successfully revoked" 
}
```

Error will be threw if:

1. revoke token schema does not meet
2. token not found
3. non-admin user trys to revoke a token other than his own


## Implementation Details

### How to keep users login

Cookies were used to store refresh token, and JsonWebToken was used to authenticate user.

Upon successful authentication, the api returns a short lived JWT access token that expires after 15 minutes, and a refresh token that expires after 7 days in a HTTP Only cookie. The JWT is used for accessing secure routes on the api and the refresh token is used for generating new JWT access tokens when/just before they expire.

### Account management (CRUD) routes with role based access control

The first account is assigned to the Admin role and subsequent accounts are assigned to the User role. Admins have full access to CRUD routes for managing all accounts, while regular users can only modify their own account.

An authorization middleware was used to restrict the access of the route to only the role(s) specified in the parameter. The authorize function returns an array containing two middleware functions:
1. expressjwt authenticates the request by validating the JWT access token in the "Authorization" header of the http request. On successful authentication a user object is attached to the req object (req.auth) that contains the data from the JWT token.
2. The second function authorizes the request by verify the existence of the account and is authorized to access the requested route based on its role. The second function also attaches the role property and the ownsToken method to the req.auth object so they can be accessed by controller functions.

### How to securely persist the registered users

[Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) was used to hash the password with unique salt at runtime and store the hashed password in the database. 
