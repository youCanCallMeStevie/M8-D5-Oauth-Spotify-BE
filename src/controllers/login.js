const express = require("express");
const passport = require("passport");

const UserModel = require("../models/userSchema");
const ApiError = require("../classes/apiError");
const { authenticate, refresh } = require("../auth/tools");

exports.loginController = async (req, res, next) => {
  try {
    //Check credentials
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    if (!user) throw new ApiError(400, "Invalid email or password");
    //Generate token
    const { accessToken, refreshToken } = await authenticate(user);
    //Send back tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/refreshToken",
    });
    res.send("Ok");
  } catch (error) {
    console.log("SigninController error: ", error);
    next(error);
  }
};


exports.logoutController = async (req, res, next) => {
	try {
		req.user.refreshTokens = req.user.refreshTokens.filter(
			(t) => t.token !== req.body.refreshToken
		);
		await req.user.save();
		res.send("OK");
	} catch (err) {
		console.log("Logout error: ", err);
		next(err);
	}
};

exports.refreshTokenController= async (req, res, next) => {
  try {
    // Grab the refresh token
    console.log(req.cookies);
    const oldRefreshToken = req.cookies.refreshToken;
    // Verify the token
    // If it's ok generate new access token and new refresh token
    const { accessToken, refreshToken } = await refresh(oldRefreshToken);
    // send them back
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

exports.oAuthRedirectController= async (req, res, next) => {
  try {
    console.log("req.user", req.user)
    const {accessToken, refreshToken} = req.user.tokens
    //setting a cookie and giving it a name
    res.cookie("accessToken", accessToken, 
    //providing options, which means the JS code cannot check the content
    {
      httpOnly: true,
      //anther option is 'secure' and this is regarding using https
    });
    //setting a cookie and giving it a name
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      //determine when the cookie needs to be used
      path: "/refreshToken",
    });
    res.status(200).redirect(`${process.env.FE_URL}/home`); //sending back to FE & there is no body in a redirect
  } catch (error) {
    next(error);
  }

}



exports.registerController = async (req, res, next) => {
	const { email } = req.body;
	try {
		const foundUser = await UserModel.findOne({ email });
		if (foundUser) throw new ApiError(400, "Email already exist!");
		const newUser = new UserModel({ ...req.body });
		await newUser.save();
		res.status(201).json({ success: true, data: "Successfully created" });
	} catch (error) {
		console.log("registerController error:", error);
		next(error);
	}
};






exports.logoutAllController = async (req, res, next) => {
	try {
		req.user.refreshTokens = [];
		await req.user.save();
		res.clearCookie("token");
		res.clearCookie("refreshToken");
		res.send("OK");
	} catch (error) {
		console.log("LogoutAll error: ", error);
		next(error);
	}
};

exports.userLoginController = async (req, res, next) => {
  try {
    //extract the token from the cokie and verify if user is authorized
  } catch (error) {
    console.log("userLoginController error: ", error);
		next(error);
  }
}