const express = require("express");
const passport = require("passport");

const router = express.Router();
const {  oAuthRedirectController, refreshTokenController,loginController, logoutController, registerController, userLoginController  } = require("../controllers/login");
const {authorize} = require("../auth/middleware")
// const validation = require("../validation/validationMiddleware");
// const valSchema = require("../validation/validationSchema");

router.post(
  "/register",
  registerController
);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/refreshToken", refreshTokenController);
router.get(
  "/spotifyLogin",
  passport.authenticate("spotify", { scope: ["user-read-private", "user-read-email"]})
);
router.get("/spotifyRedirect",passport.authenticate("spotify"), oAuthRedirectController);
router.get("/googleRedirect",passport.authenticate("google"), oAuthRedirectController);
router.get(
  "/googleLogin",             
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get("/me", authorize, userLoginController);

// router.get("/fbRedirect",passport.authenticate("facebook"), oAuthRedirectController);
// router.get(
//   "/fbLogin",             
//   passport.authenticate("facebook", { scope: ["public_profile", "email"] })
// );

module.exports = router;