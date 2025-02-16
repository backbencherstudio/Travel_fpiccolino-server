const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyUser = async (req, res, next) => {
  const { token } = req.cookies;
  const JWT_SECRET = process.env.WEBTOKEN_SECRET_KEY;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }

  try {
    const decodedToken = verify(token, JWT_SECRET);
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyUser };
