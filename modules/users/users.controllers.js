require("dotenv").config();
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const path = require("path");

const User = require("./users.models");
const Order = require("../order/order.models");

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
    let users = await User.find();

    const usersResponse = users.map(user => ({
      ...user.toObject(),
      image: user.image ? getImageUrl(user.image) : null,
    }));

    res.status(200).json(usersResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
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
    res.status(500).json({ message: "Internal server error", error: error.message });
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

    console.log(savedUser);
    res
      .status(200)
      // .cookie("token", token, options)
      .json({ token, user: savedUser, success: true });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

// Authenticate user
const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ email }).lean(); // Use `lean()` for a plain object

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.email, user.role);

    setTokenCookie(res, token);

    // Add `image_url` if the user has an image
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
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });

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



// done By Tohidul
const userOrderGroupedByStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all orders for the user and populate packageId to access package details
    const orders = await Order.find({ userId })
      .populate({
        path: "packageId", // Populate packageId
        select: "images tourName price", // Select only the required fields
      })
      .exec();

    // Group orders by their status and include the first image from package
    const groupedOrders = orders.reduce((acc, order) => {
      const packageData = order.packageId || {};
      const firstImage = packageData.images && packageData.images[0] ? packageData.images[0] : null;

      if (!acc[order.status]) {
        acc[order.status] = { orders: [], total: 0 }; // Initialize for new status
      }
      acc[order.status].orders.push({
        ...order.toObject(),
        packageImage: firstImage, // Add the first image of the package
        packageName: packageData.tourName || "Unknown", // Add the tour name
        packagePrice: packageData.price || "Unknown", // Add the price
      });
      acc[order.status].total += 1; // Increment the count for this status
      return acc;
    }, {});

    // Calculate total orders for the user
    const totalOrders = orders.length;

    res.status(200).json({
      message: "Orders grouped by status fetched successfully",
      data: groupedOrders,
      totalOrders, // Add the total number of orders to the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  userOrderGroupedByStatus,
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
  userOrderGroupedByStatus
};
