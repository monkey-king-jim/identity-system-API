const express = require("express");
const app = express();
const cors = require("cors");

const sequelize = require("./model/user");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const router = require("./routes/router.js");
app.use("/api", router);

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
