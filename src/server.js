const express = require("express");
const dotenv = require("dotenv");
const listEndpoints = require("express-list-endpoints");

const logInRoute = require("./routes/loginRoute");
const deezerRoute = require("./routes/deezerRoute");

const passport = require("passport");
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");
const mongoose = require("mongoose");
const cors = require("cors");
const oauth = require("./auth/oauth"); //import so that the google strategy can be used by passport, but it isn't called any where

//INITIAL SETUP
const server = express();
const port = process.env.PORT || 4000;

//MIDDLEWARES

const whitelist = [`${process.env.FE_URL}`, `${process.env.FE_URL_DEV}` ]; //whose allowed, which can be an array of strings
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //credentials=cookies, and letting cors know that cookies are allowed
};

server.use(cors(corsOptions)); //if using cookies, you can't leave cors empty
server.use(passport.initialize());
server.use(express.json());

//ROUTES
server.use("/", logInRoute);
server.use("/deezer", deezerRoute);

//ERROR HANDLERS
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      if (server.get("env") === "production")
      console.log("Server is running on CLOUD on PORT:", port);
      console.log("Server is running LOCALLY on PORT: http://localhost:", port);
    })
  )
  .catch((err) => console.log(err));
