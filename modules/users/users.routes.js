const {
  getAllUsers,
  checkAuthStatus,
  registerUser,
  verifyOTP,
  getSingleUser,
  authenticateUser,
  editUserProfile,
  forgotPasswordOTPsend,
  resetPasssword,
  matchForgotPasswordOTP,
  resendOtp,
  logout,
} = require("./users.controllers");

const { verifyUser } = require("../../middleware/verifyUser");
const { upload } = require("../../middleware/Multer.config");

const route = require("express").Router();

route.get("/", getAllUsers);

route.get("/check", checkAuthStatus);

route.post("/register", registerUser);
route.post("/verify-otp", verifyOTP);
route.post("/resendotp", resendOtp);
route.post("/login", authenticateUser);

route.put(
  "/update-profile",
  upload.single("image"),
  verifyUser,
  editUserProfile
);

route.post("/logout", logout);

// Forgot passwords
route.post("/request-forgot-password-otp", verifyUser, forgotPasswordOTPsend);
route.post("/match-password-otp", verifyUser, matchForgotPasswordOTP);
route.patch("/reset-forgot-password", verifyUser, resetPasssword);

route.get("/:id", getSingleUser);

module.exports = route;
