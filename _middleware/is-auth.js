require("dotenv").config("../.env");
const jwt = require("express-jwt");
const SECRET = process.env.SECRET;

module.exports = isAuth;

function isAuth() {
  return [
    // auth jwt token
    jwt({ SECRET, algorithms: ["HS256"] }),

    async (req, res, next) => {
      // user ID contained in subject property in token
      const user = await db.User.findByPk(req.user.subject);

      if (!user) return res.status(401).json({ message: "Unauthorzied User!" });

      // auth succeed and attach user instance got by ID to req.user
      req.user = user.get();
      next();
    },
  ];
}
