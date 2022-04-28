require("dotenv").config("../.env");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const db = require("_helpers/db");

// export service objects with encapsulated interaction with user model
module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  authenticate,
};

async function authenticate({ userLoginInfo, password }) {
  const user = await db.User.scope("withPassword").findOne({
    where: {
      [Op.or]: [{ username: userLoginInfo }, { email: userLoginInfo }],
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw "User login info or password is incorrect";

  // authentication succeed
  const token = jwt.sign(
    { subject: user.id, message: "foo" },
    process.env.SECRET,
    {
      expiresIn: "1w",
    }
  );
  return { ...omitPassword(user.get()), token };
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
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
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // sign up user
  await db.User.create(params);
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

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
