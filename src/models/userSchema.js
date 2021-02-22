const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs")

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: false,
    },

    username: {
      type: String,
      required: false,
    },
    password: { type: String, required: false, minlength: 8 },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      required: "An email address is required",
    },
    subscription: {
        type: String,
        enum: ["premium", "basic"], required: false,
      },
    profileImg: { type: String, required: false},
    refreshTokens: [{ token: { type: String } }],
    spotifyId: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },

  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.statics.findByCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email })
  // console.log(user)

  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password)
    if (isMatch) return user
    else return null
  } else {
    return null
  }
}

UserSchema.pre("save", async function (next) {
  const user = this
  const plainPW = user.password

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 10)
  }
  next()
})


const UserModel = model("User", UserSchema);
module.exports = UserModel;
