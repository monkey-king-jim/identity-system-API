const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const db = require("../lib/db.js");
const userMiddleware = require("../middleware/users.js");

router.post(
  "/sign-up",
  userMiddleware.validateRegister,
  async (req, res, next) => {
    const username = db.escape(req.body.name);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    db.getConnection(async (err, connection) => {
      if (err) throw err;
      const sqlSearch =
        "SELECT * FROM userTable WHERE LOWER(username) = LOWER(?)";
      const search_query = mysql.format(sqlSearch, [username]);

      const sqlInsert = `INSERT INTO userTable VALUES ('${uuid.v4()}',?,?, now())`;
      const insert_query = mysql.format(sqlInsert, [username, hashedPassword]);

      await connection.query(search_query, async (err, result) => {
        if (err) throw err;
        console.log("------> Search Results");

        if (result.length != 0) {
          connection.release();
          console.log("------> User already exists");
          res.sendStatus(409);
        } else {
          await connection.query(insert_query, (err, result) => {
            connection.release();
            if (err) throw err;
            console.log("--------> Created new User");
            console.log(result.insertId);
            res.sendStatus(201);
          });
        }
      });
    });
  }
);
router.post("/login", (req, res, next) => {});
// router.get("/secret-route", (req, res, next) => {
//   res.send("This is the secret content.");
// });
module.exports = router;
