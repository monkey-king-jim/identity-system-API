const express = require("express");
const router = express.Router();
const authorize = require("_middleware/authorize");
const userService = require("./user.service");
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');

router.post("/login", loginSchema, login);
router.post("/sign-up", signupSchema, signup);
router.get("/", authorize(), getAll);
router.get("/current", authorize(), getCurrent);
router.get("/:id", authorize(), getById);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);

module.exports = router;

function loginSchema(req, res, next) {
  const schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required();
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}