const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const admin = require("../utils/firebaseAdmin");

const { User } = require("../models/index");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const ctrlLoginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  const decoded = await admin.auth().verifyIdToken(idToken);
  const { email, name, picture } = decoded;

  let user = await User.findOne({ where: { email } });
  let userType = 'old';
  if (!user) {
    user = await User.create({
      email: email,
      username: name || "",
      profilePhoto: picture,
      signWithplatform: decoded.firebase.sign_in_provider,
      isEmailVerified: true,
    });
    userType = 'new';
  }

  const token = jwt.sign(
    { user_id: user.user_id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
  res
    .status(200)
    .json(new apiResponse(200, [user, token, userType], "Logged In SuccessFully"));
};

const ctrlRegister = async (req, res) => {
  const { username, password, email, firebaseUid } = req.body;
  console.log(req.body)
  const usercheck = await User.findOne({ where: { email } });
  if (usercheck) {
    throw new apiError(402, "User Already Exist With This Detail");
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    firebase_uid: firebaseUid,
    signWithplatform: "register",
  });

  res
    .status(200)
    .json(new apiResponse(200, user, "User Created SuccessFullly"));
};

const ctrlLogin = async (req, res) => {
  const { username, password } = req.body;
  const usercheck = await User.findOne({ where: { username } });
  if (!usercheck) {
    throw new apiError(404, "No User Found");
  }

  if (!usercheck.isEmailVerified) {
    throw new apiError(402, "Please verify your email before logging in.");
  }

  const passwordCheck = await bcrypt.compare(password, usercheck.password);
  if (!passwordCheck) {
    throw new apiError(402, "Invalid Password");
  }

  if (usercheck.isEmailVerified === false) {
    throw new apiError(402, "First Verify Your Email");
  }

  const token = jwt.sign(
    { user_id: usercheck.user_id, username: usercheck.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
  res
    .status(200)
    .json(new apiResponse(200, [usercheck, token], "Logged In SuccessFully"));
};

const ctrlEmailVeify = async (req, res) => {
  const { idToken } = req.body;

  const decoded = await admin.auth().verifyIdToken(idToken);
  if (!decoded.email_verified) {
    return res.status(400).json({ message: "Email not verified yet" });
  }

  const user = await User.findOne({ where: { email: decoded.email } });
  if (!user) {
    throw new apiError(404, "No User Found");
  }

  user.isEmailVerified = true;
  await user.save();

  res.status(200).json(new apiResponse(200, [], "Email Verified"));
};

const ctrlChangePassword = async (req, res) => {
    const { password } = req.body;
    const user = req.user;
    
    const hashedPassword = await bcrypt.hash(password, 8);
    await User.update({ password: hashedPassword }, { where: { user_id: user.user_id } });
    
    res.status(200).json(new apiResponse(200, [], "Password Changed Successfully"));
};

module.exports = {
  ctrlLoginWithGoogle,
  ctrlRegister,
  ctrlLogin,
  ctrlEmailVeify,
  ctrlChangePassword,
};
