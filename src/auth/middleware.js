const jwt = require("jsonwebtoken");
const UserModel = require("../models/userSchema");
const { verifyJWT } = require("./tools");

const authorize = async (req, res, next) => {
  try {
    //const token = req.header("Authorization").replace("Bearer ", "")

    const token = req.cookies.accessToken; //comes with cookieParsar, and cookies is a field of the headers & will find the cookies in side
    const decoded = await verifyJWT(token);
    const user = await UserModel.findOne({ _id: decoded._id });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    const err = new Error("Authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

const premiumOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.subscription === "Premium") next();
  else {
    const err = new Error("Only for Spotify Premium members!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = { authorize, premiumOnlyMiddleware };
