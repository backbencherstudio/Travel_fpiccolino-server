require("dotenv").config();
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");

const User = require("./users.models");

const {
  generateOTP,
  sendUpdateEmailOTP,
  sendForgotPasswordOTP,
  sendRegistrationOTPEmail,
} = require("../../util/otpUtils");

const generateToken = (id, email, role) => {
  return sign({ userId: id, email, role }, process.env.WEBTOKEN_SECRET_KEY, {
    expiresIn: "30d",
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(8);
  return await bcrypt.hash(password, salt);
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    let user = await User.find();
    // const token = req.cookies.authToken;
    // console.log(token);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    console.log(name, email, password, role);

    if (!(name && email && password)) {
      res.status(400).json({
        message: "Please fill all required fields",
      });
      return;
    }

    name = name.replace(/\s+/g, " ").trim();

    // Validate email and password
    if (!isEmail(email)) {
      res.status(400).json({
        message: "Please enter a valid email address",
      });
      return;
    }
    if (email === name) {
      res.status(400).json({
        message: "Email cannot be the same as your name",
      });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be longer than 6 characters",
      });
      return;
    }
    if (password === name || password === email) {
      res.status(400).json({
        message: "Password cannot be the same as your name or email",
      });
      return;
    }

    // Parallelize database query and password hashing
    const [exuser, hashedPassword, OTP] = await Promise.all([
      User.findOne({ email }),
      bcrypt.hash(password, 8),
      generateOTP(),
    ]);

    if (exuser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // Store user data and OTP in session
    req.session.otp = OTP;
    req.session.userData = { name, password: hashedPassword, email, role };

    console.log(req.session.userData);

    // Send OTP email in the background (don't await)
    sendRegistrationOTPEmail(name, email, OTP)
      .then(() => console.log("OTP email sent"))
      .catch((err) => console.error("Error sending OTP email:", err));

    res.status(200).json({ otp: "success" });
  } catch (error) {
    console.log(error);
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { userData } = req.session;

    if (!userData?.email || !userData?.name) {
      res.status(400).json({ message: "User data not found!" });
      return;
    }

    const OTP = generateOTP();
    req.session.otp = OTP;

    // Send OTP email in the background (non-blocking)
    sendRegistrationOTPEmail(userData.name, userData.email, OTP)
      .then(() => console.log("OTP email sent"))
      .catch((err) => console.error("Error sending OTP email:", err));

    // Respond immediately without waiting for email to be sent
    res.status(200).json({ message: "OTP resent successfully", otp: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    console.log(122, req.body);
    const { otp } = req.body;
    console.log(otp);

    if (
      !req.session.userData ||
      !req.session.userData.name ||
      !req.session.userData.email ||
      !req.session.userData.password
    ) {
      res.status(400).json({
        message: "Registration incomplete",
      });
      return;
    }

    console.log("req.session.otp", req.session.otp);

    if (otp != req.session.otp) {
      res.status(400).json({
        message: "Invalid OTP",
      });
      return;
    }

    const newUser = new User(req.session.userData);

    // Generate JWT and save the user simultaneously
    const [savedUser, token] = await Promise.all([
      newUser.save(),
      generateToken(newUser._id, newUser.email, newUser.role),
    ]);
    setTokenCookie(res, token);

    // Clear session data after successful save
    delete req.session.userData;
    delete req.session.otp;

    // const options = {
    //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // };

    res
      .status(200)
      // .cookie("token", token, options)
      .json({ token, user: savedUser, success: true });
  } catch (error) {
    res.status(500).json(error);
    console.log(error)
  }
};

// Authenticate user
const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      res.status(400).json({ message: "Please fill all required fields" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    console.log(user);
    const token = generateToken(user._id, user.email, user.role);

    setTokenCookie(res, token);

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      // .cookie("token", token, options)
      .json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json(error.message);
  }
};





const editUserProfile = async (req, res) => {
  const normalizePath = (filePath) => filePath.replace(/\\/g, '/'); 

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (req.file) {
      // Save relative file path for avatar in the database
      req.body.avatar = `/uploads/images/${req.file.filename}`;
    }

    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);  // Hash the password if provided
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);  // Return updated user information
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Forgot password OTP send
const forgotPasswordOTPsend = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: `User not found`,
      });
      return;
    }
    const otp = generateOTP();

    req.session.otp = otp.toString();
    req.session.email = user.email;

    if (user.name) await sendForgotPasswordOTP(user.name, user.email, otp);

    res
      .status(200)
      .json({ message: "OTP sent successfully for password change" });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Match forgot password OTP
const matchForgotPasswordOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      res.status(400).json({
        message: `OTP is required`,
      });
      return;
    }

    if (otp !== req.session.otp || otp === undefined) {
      res.status(400).json({
        message: `OTP does not match`,
      });
      return;
    }

    req.session.isOtpValid = true;

    res.status(200).json({
      success: true,
      message: "OTP matched successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Reset password
const resetPasssword = async (req, res) => {
  try {
    if (!req.session.isOtpValid) {
      res.status(400).json({ message: "OTP invalid" });
      return;
    }
    const { password } = req.body;

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    await User.findOneAndUpdate(
      { email: req.session.email },
      { password: hashedPassword }
    );

    // Clear session after password reset
    req.session.destroy();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const checkAuthStatus = async (req, res) => {
  const JWT_SECRET = process.env.WEBTOKEN_SECRET_KEY;

  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(400).json({ authenticated: false });
      return;
    }

    verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid token", authenticated: false });
      }

      const userId = decoded.userId;

      const userInfo = await User.findById(userId);
      if (!userInfo) {
        return res
          .status(404)
          .json({ message: "User not found", authenticated: false });
      }

      return res.status(200).json({ authenticated: true, user: userInfo });
    });
  } catch (error) {
    console.error("Error in checkAuthStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  checkAuthStatus,
  logout,
  resetPasssword,
  matchForgotPasswordOTP,
  forgotPasswordOTPsend,
  editUserProfile,
  authenticateUser,
  verifyOTP,
  resendOtp,
  registerUser,
  getAllUsers,
};
