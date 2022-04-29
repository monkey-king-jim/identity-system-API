const express = require("express");
const router = express.Router();
const isAuth = require("_middleware/is-auth");
const userService = require("./user.service");
const Joi = require("joi");
const validateRequest = require("_middleware/validate-req");

router.post("/login", loginSchema, login);
router.post("/sign-up", signupSchema, signup);
router.get("/", isAuth(), getAll);
router.get("/current", isAuth(), getCurrent);
router.get("/:id", isAuth(), getById);
router.put("/:id", isAuth(), updateSchema, update);
router.delete("/:id", isAuth(), _delete);

module.exports = router;

function loginSchema(req, res, next) {
  const schema = Joi.object({
    loginInfo: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function login(req, res, next) {
  userService
    .login(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function signupSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
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
  res.json(req.user);
}

function getById(req, res, next) {
  console.log("Hi");
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().empty(""),
    email: Joi.string().email().empty(""),
    password: Joi.string().min(6).empty(""),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
}
