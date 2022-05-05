const express = require("express");
const router = express.Router();
const isAuth = require("_middleware/is-auth");
const userService = require("./user.service");
const Joi = require("joi");
const validateRequest = require("_middleware/validate-req");
const Role = require("_helpers/role");

router.post("/login", loginSchema, login);
router.post("/refresh-token", refreshToken);
router.post("/revoke-token", isAuth(), revokeTokenSchema, revokeToken);
router.post("/sign-up", signupSchema, signup);
router.get("/", isAuth(Role.Admin), getAll);
router.get("/current", isAuth(), getCurrent);
router.get("/:id", isAuth(), getById);
router.put("/:id", isAuth(), updateSchema, update);
router.delete("/:id", isAuth(), _delete);

module.exports = router;

function loginSchema(req, res, next) {
  const schema = Joi.object({
    // login by username or email
    loginInfo: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function login(req, res, next) {
  userService
    .login(req.body)
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
}

function refreshToken(req, res, next) {
  const token = req.cookies.refreshToken;
  userService
    .refreshToken(token)
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
}

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
  // get token from req body or cookie
  const token = req.body.token || req.cookies.refreshToken;

  if (!token) return res.status(400).json({ message: "Token not found" });

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.auth.ownsToken(token) && req.auth.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .revokeToken(token)
    .then(() => res.json({ message: "Token successfully revoked" }))
    .catch(next);
}

function signupSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    acceptTerms: Joi.boolean().valid(true).required(),
  });
  validateRequest(req, next, schema);
}

function signup(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ message: "Sign up successfully" }))
    .catch(next);
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.auth);
}

function getById(req, res, next) {
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schemaRules = Joi.object({
    username: Joi.string().empty(""),
    email: Joi.string().email().empty(""),
    password: Joi.string().min(6).empty(""),
    confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
    firstName: Joi.string().empty(""),
    lastName: Joi.string().empty(""),
  });

  if (req.auth.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty("");
  }

  const schema = Joi.object(schemaRules).with("password", "confirmPassword");

  validateRequest(req, next, schema);
}

function update(req, res, next) {
  // users can update their own account and admins can update any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  // users can delete their own account and admins can delete any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
}

// helpers

function setTokenCookie(res, token) {
  // create cookie with refresh token that expires in a week
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
}
