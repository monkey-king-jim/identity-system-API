require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// api
app.use("/users", require("./users/users.controller"));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.PORT;
app.listen(port, () => console.log("Server listening on port " + port));
