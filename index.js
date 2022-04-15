const express = require("express");
const app = express();

const sequelize = require("./model/user");

const PORT = process.env.PORT || 3000;

app.use(express.json());
// app.use(cors());

const router = require("./routes/router.js");
app.use("/auth", router);

app.use((error, req, res) => {
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
