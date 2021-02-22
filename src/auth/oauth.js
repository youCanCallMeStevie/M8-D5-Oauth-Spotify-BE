const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userSchema");
const { authenticate } = require("./tools");
// passport.use(new FacebookStrategy({
//   clientID: FACEBOOK_APP_ID,
//   clientSecret: FACEBOOK_APP_SECRET,
//   callbackURL: "http://localhost:3000/auth/facebook/callback"
// },
// function(accessToken, refreshToken, profile, cb) {
 
//     console.log("fb", profile);
//     // const newUser = {
//     //   spotifyId: userProfile.id,
//     //   name: userProfile.display_name,
//     //   email: userProfile.email,
//     //   subscription: userProfile.product,
//     //   profileImg: userProfile.href,
//     //   refreshTokens: [],
//     // };

//     try {
//       const user = await UserModel.findOne({ facebookId: profile.id }); //check that it is profile.id
//       //if spotify user exists, then generate tokens
//       if (user) {
//         const tokens = await authenticate(user);
//         done(null, { user, tokens }); //first parameter is error
//       } else {
//         //if  user does not exist, just save it into the db and generate tokens for user

//         const createdUser = new UserModel(newUser);
//         await createdUser.save();
//         const tokens = await authenticate(createdUser);
//         done(null, { user: createdUser, tokens });
//       }
//     } catch (error) {
//       done(error);
//     }
//   }
// )
// );



passport.use(
  "spotify",
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENTID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: `${process.env.BE_URL}/spotifyRedirect`,
    },
    async function (accessToken, refreshToken, expires_in, profile, done) {
      const userProfile = profile._json;
      console.log("new", profile);
      const newUser = {
        spotifyId: userProfile.id,
        name: userProfile.display_name,
        email: userProfile.email,
        subscription: userProfile.product,
        profileImg: userProfile.href,
        refreshTokens: [],
      };

      try {
        const user = await UserModel.findOne({ spotifyId: profile.id }); //check that it is profile.id
        //if spotify user exists, then generate tokens
        if (user) {
          const tokens = await authenticate(user);
          done(null, { user, tokens }); //first parameter is error
        } else {
          //if  user does not exist, just save it into the db and generate tokens for user

          const createdUser = new UserModel(newUser);
          await createdUser.save();
          const tokens = await authenticate(createdUser);
          done(null, { user: createdUser, tokens });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.BE_URL}/googleRedirect`,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      const newUser = {
        googleId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value, //because this is returning an array
        profileImg: profile.picture,
        refreshTokens: [],
      };

      try {
        const user = await UserModel.findOne({ googleId: profile.id });
        //if google user exists, then generate tokens
        if (user) {
          const tokens = await authenticate(user);
          done(null, { user, tokens }); //first parameter is error
        } else {
          //if google user does not exist, just save it into the db and generate tokens for user

          const createdUser = new UserModel(newUser);
          await createdUser.save();
          const tokens = await authenticate(createdUser);
          done(null, { user: createdUser, tokens });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
