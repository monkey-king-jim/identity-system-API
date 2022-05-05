require("dotenv").config("../.env");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const db = require("_helpers/db");
const { Op } = require("sequelize");
const crypto = require("crypto");
const Role = require("_helpers/role");

// export service objects with encapsulated interaction with user model
module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  login,
  refreshToken,
  revokeToken,
};

async function login({ loginInfo, password }) {
  const user = await db.User.scope("withPassword").findOne({
    where: {
      [Op.or]: [{ username: loginInfo }, { email: loginInfo }],
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw "User login info or password is incorrect";

  // authentication succeed
  const token = generateJwtToken(user);
  const refreshToken = await generateRefreshToken(user);

  return {
    ...omitPassword(user.get()),
    token,
    refreshToken: refreshToken.token,
  };
}

async function refreshToken(token) {
  const refreshToken = await getRefreshToken(token);
  const user = await refreshToken.getUser();
  // console.log(refreshToken);

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user);
  refreshToken.revoked = Date.now();
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...omitPassword(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

async function revokeToken(token) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  await refreshToken.save();
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { username: params.username } })) {
    throw 'Username "' + params.username + '" is already used';
  }
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.username + '" is already used';
  }

  // hash password
  if (params.password) {
    params.password = await bcrypt.hash(params.password, 10);
  }

  // sign up user
  const user = await db.User.build(params);

  // assign admin role only to the 1st user
  user.role = (await db.User.count()) === 0 ? Role.Admin : Role.User;
  user.verificationToken = randomTokenString();

  await user.save();
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if updated
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitPassword(user.get());
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helpers
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function generateRefreshToken(user) {
  // create a refresh token that expires in a week
  return await user.createRefreshToken({
    token: randomTokenString(), // create a random string
    expires: new Date(Date.now() + 7 * 60 * 60 * 24 * 1000),
  });
}

async function getRefreshToken(token) {
  const refreshToken = await db.RefreshToken.findOne({ where: { token } });
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  return refreshToken;
}

function generateJwtToken(user) {
  return jwt.sign({ subject: user.id }, process.env.SECRET, {
    expiresIn: "15m",
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}
