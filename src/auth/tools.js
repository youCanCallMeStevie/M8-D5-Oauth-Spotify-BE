const jwt = require("jsonwebtoken");
const UserModel = require("../models/userSchema");

// const generateToken = async user => {
//   const accessToken = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });
//   const refreshToken = jwt.sign(
//     { id: user_id },
//     process.env.REFRESH_JWT_SECRET,
//     { expiresIn: "1d" }
//   );
//   return accessToken, refreshToken;
// };

// const verifyToken = (token, key) => {
//   let = decoded;
//   if (key == "accessToken") {
//     decoded = jwt.verify(token, process.env.JWT_SECRET);
//   } else if (key == "refreshToken") {
//     decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
//   }
//   return decoded;
// };

const generateJWT = payload =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );
const authenticate = async user => {
  try {
    const newAccessToken = await generateJWT({ _id: user._id });
    //generate refresh token at same time
    const newRefreshToken = await generateRefreshJWT({ _id: user._id });
    //save new refresh token in the db (access token is not needed)
    user.refreshTokens = user.refreshTokens.concat({ token: newRefreshToken });
    await user.save();
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const verifyJWT = token =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const generateRefreshJWT = payload =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyRefreshToken = token =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const refresh = async oldRefreshToken => {
  try {
    // Verify old refresh token
    const decoded = await verifyRefreshToken(oldRefreshToken); //  decoded._id

    // check if old refresh token is in db

    const user = await UserModel.findOne({ _id: decoded._id });

    const currentRefreshToken = user.refreshTokens.find(
      token => token.token === oldRefreshToken
    );

    if (!currentRefreshToken) {
      throw new Error("Bad refresh token provided!");
    }

    // if everything is ok I can create new access and refresh tokens

    const newAccessToken = await generateAccessToken({ _id: user._id });
    const newRefreshToken = await generateRefreshToken({ _id: user._id });

    // replace old refresh token in db with new one

    const newRefreshTokensList = user.refreshTokens
      .filter(token => token.token !== oldRefreshToken)
      .concat({ token: newRefreshToken });

    user.refreshTokens = [...newRefreshTokensList];
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { authenticate, verifyJWT, refresh };
