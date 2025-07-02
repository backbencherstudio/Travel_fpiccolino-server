require("dotenv").config();
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const path = require("path");

const User = require("./users.models");

const {
  generateOTP,
  sendUpdateEmailOTP,
  sendForgotPasswordOTP,
  sendRegistrationOTPEmail,
} = require("../../util/otpUtils");
const { getImageUrl } = require("../../util/image_path");

const generateToken = (id, email, role) => {
  return sign({ userId: id, email, role }, process.env.WEBTOKEN_SECRET_KEY, {
    expiresIn: "30d",
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    maxAge: 3 * 365 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
  return res;
};

const setCookie = (key, data, res) => {
  res.cookie(key, data, {
    maxAge: 3 * 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
};

const generateRefreshToken = (userId) => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'
  });
};

// Add refresh token when setting cookies
const setTokens = (res, accessToken, refreshToken) => {
  setTokenCookie(res, accessToken);
  res.cookie('refreshToken', refreshToken, {
    maxAge: 3 * 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    path: '/'
  });
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;

    // Prepare filter conditions
    const queryConditions = [];

    // Search filter
    if (search) {
      queryConditions.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      });
    }

    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      queryConditions.push({
        createdAt: { $gte: start, $lte: end }, // Filter by createdAt date range
      });
    }

    // Query the database with filters
    let users = queryConditions.length
      ? await User.find({ $and: queryConditions }).sort({ createdAt: -1 })
      : await User.find().sort({ createdAt: -1 });

    // Format the users' data
    const usersResponse = users.map((user) => ({
      ...user.toObject(),
      image: user.image ? getImageUrl(user.image) : null,
    }));

    res.status(200).json(usersResponse);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userResponse = {
      ...user,
      image: user.image ? getImageUrl(user.image) : null,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
    // req.session.otp = OTP;
    setCookie("otp", OTP, res);
    const userData = { name, password: hashedPassword, email, role };
    setCookie("userData", userData, res);

    // req.session.userData = { name, password: hashedPassword, email, role };

    // console.log(req.session.userData);

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
    const { userData } = req.cookie;

    if (!userData?.email || !userData?.name) {
      res.status(400).json({ message: "User data not found!" });
      return;
    }

    const OTP = generateOTP();

    setCookie("otp", OTP, res);
    sendRegistrationOTPEmail(userData.name, userData.email, OTP)
      .then(() => console.log("OTP email sent"))
      .catch((err) => console.error("Error sending OTP email:", err));

    res.status(200).json({ message: "OTP resent successfully", otp: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!req.cookies.otp || !req.cookies.userData) {
      res.status(400).json({
        message: "Registration incomplete",
      });
      return;
    }

    if (otp != req.cookies.otp) {
      res.status(400).json({
        message: "Invalid OTP",
      });
      return;
    }

    const newUser = new User(req.cookies.userData);

    // Generate JWT and save the user simultaneously
    const [savedUser, token] = await Promise.all([
      newUser.save(),
      generateToken(newUser._id, newUser.email, newUser.role),
    ]);

    res.status(200);
    setTokenCookie(res, token).json({ token, user: savedUser, success: true });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

// Authenticate user
const authenticateUser = async (req, res) => {

  try {
    const { email, password } = req.body;
    console.log(email)

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ email }).lean(); // Get plain JS object
    console.log(user)

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    console.log("plain:", password);
    console.log("hashedPassword", user.password);

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("isMatched", passwordMatch);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.email, user.role);
    setTokenCookie(res, token);

    const userResponse = {
      ...user,
      image_url: user.image ? getImageUrl(user.image) : null,
    };

    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error in authenticateUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editUserProfile = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    // if (req?.body?.password && req?.body?.password?.length >0) {
    //   console.log("password heat")
    //   req.body.password = await hashPassword(req.body.password);
    // }

    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    }).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      ...updatedUser,
      image_url: updatedUser.image ? getImageUrl(updatedUser.image) : null,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Forgot password OTP send
const forgotPasswordOTPsend = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        message: `Email is required`,
      });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: `User not found`,
      });
      return;
    }
    const otp = generateOTP().toString();

    // req.session.otp = otp.toString();
    setCookie("otp", otp, res);
    // req.session.email = user.email;
    setCookie("email", user.email, res);
    if (user.name) await sendForgotPasswordOTP(user.name, user.email, otp);

    res.status(200).json({
      message: "OTP sent successfully for password change",
      success: true,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Match forgot password OTP
const matchForgotPasswordOTP = async (req, res) => {
  console.log("route heat");
  console.log("otp", req.body);
  console.log("cookie", req.cookies.otp);
  try {
    const { otp } = req.body;
    if (!otp) {
      res.status(400).json({
        message: `OTP is required`,
      });
      return;
    }

    if (otp !== req.cookies.otp || otp === undefined) {
      res.status(400).json({
        message: `OTP does not match`,
      });
      return;
    }

    // req.session.isOtpValid = true;
    setCookie("isOtpValid", true, res);
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
  console.log("hiiiiiiiiiii");
  try {
    if (!req.cookies.isOtpValid) {
      res.status(400).json({ message: "OTP invalid" });
      return;
    }
    const { password } = req.body;
    console.log(password);

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    await User.findOneAndUpdate(
      { email: req.cookies.email },
      { password: hashedPassword }
    );

    // Clear session after password reset
    req.session.destroy();
    res.clearCookie("otp");
    res.clearCookie("email");
    res.clearCookie("isOtpValid");

    res
      .status(200)
      .json({ message: "Password reset successfully", success: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

const checkAuthStatus = async (req, res) => {
  const JWT_SECRET = process.env.WEBTOKEN_SECRET_KEY;

  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({ authenticated: false });
    }

    verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid token", authenticated: false });
      }

      const userId = decoded.userId;

      const userInfo = await User.findById(userId).lean(); // Use `lean()` to get plain JS object

      if (!userInfo) {
        return res
          .status(404)
          .json({ message: "User not found", authenticated: false });
      }

      const userResponse = {
        ...userInfo,
        image_url: getImageUrl(userInfo.image),
      };

      return res.status(200).json({ authenticated: true, user: userResponse });
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
  getSingleUser,
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
