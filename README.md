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
