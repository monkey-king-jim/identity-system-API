require("dotenv").config("../.env");
const { expressjwt: jwt } = require("express-jwt");
const SECRET = process.env.SECRET;

module.exports = isAuth;

function isAuth(roles = []) {
  // param can be a string or array
  // e.g. 'User'/ Role.User/ [Role.Admin, Role.User]

  if (typeof roles === "string") roles = [roles];

  return [
    // auth jwt token
    jwt({ secret: SECRET, algorithms: ["HS256"] }),

    async (req, res, next) => {
      // user ID contained in subject property in token
      const user = await db.User.findByPk(req.auth.subject);

      if (!user || (roles.length && !roles.includes(account.role)))
        return res.status(401).json({ message: "Unauthorzied User!" });

      // auth succeed and attach user instance got by ID to req.user
      req.user.role = user.role;
      next();
    },
  ];
}
