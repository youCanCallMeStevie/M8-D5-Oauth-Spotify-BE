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
    const err = new Error("User is not authorized");
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


// const checkBearerToken = async (req, res, next) => {
//   if(req.headers.authorization){
//     const [method, jwt] = req.headers.authorization.split(" ")
//     if(method==="Bearer"&&jwt){
//       try {
//         const {_id} = await verifyJWT(jwt)
//         const user = await UserModel.findById(_id)
//         if(user){
//           req.user=user;
//           next()
//         }
//       } catch (error) {
//         res.status(400).send("id is bad")
//       }
//     } else {
//       res.status(400).send("token is bad")
//     }
//   }
// }
module.exports = { authorize, premiumOnlyMiddleware };
