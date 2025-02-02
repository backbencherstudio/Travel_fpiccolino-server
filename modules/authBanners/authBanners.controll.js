const multer = require("multer");
const fs = require("fs");
const path = require("path");
const authBannersModel = require("./authBanners.model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Helper function to delete file
const deleteFile = (filePath) => {
  if (!filePath) return;

  try {
    const normalizedPath = filePath.replace(/\\/g, "/");
    const fileName = normalizedPath.split("/").pop();
    const absolutePath = path.join(process.cwd(), "uploads", fileName);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`Successfully deleted file: ${absolutePath}`);
    } else {
      console.log(`File not found: ${absolutePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file:`, error);
  }
};

// Log the model import at the top
console.log("Imported authBannersModel:", authBannersModel);

exports.updateAuthBanners = [
  upload.fields([
    { name: "loginBanner", maxCount: 1 },
    { name: "registerBanner", maxCount: 1 },
    { name: "forgotBanner", maxCount: 1 },
    { name: "otpBanner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Update request received:", {
        files: req.files,
        body: req.body,
      });

      let currentBanners = await authBannersModel.findOne();
      if (!currentBanners) {
        currentBanners = await authBannersModel.create({
          loginBanner: "",
          registerBanner: "",
          forgotBanner: "",
          otpBanner: "",
        });
      }

      const bannerTypes = ["login", "register", "forgot", "otp"];
      const updatedBanners = {};

      // Process each banner type
      for (const type of bannerTypes) {
        const newBanner = req.files?.[`${type}Banner`]?.[0];
        const originalPath = req.body[`${type}BannerOriginalPath`];

        if (newBanner) {
          // If there's a new file uploaded
          updatedBanners[`${type}Banner`] = newBanner.path.replace(/\\/g, "/");

          // Delete old file if it exists
          if (originalPath) {
            deleteFile(originalPath);
          }
        } else if (originalPath) {
          // Keep existing path if no new file
          updatedBanners[`${type}Banner`] = originalPath;
        } else {
          // Keep current value or empty string
          updatedBanners[`${type}Banner`] =
            currentBanners[`${type}Banner`] || "";
        }
      }

      console.log("Updating banners with:", updatedBanners);

      const updatedDoc = await authBannersModel.findOneAndUpdate(
        {},
        { $set: updatedBanners },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      );

      console.log("Update result:", updatedDoc);

      return res.status(200).json({
        message: "Banners updated successfully",
        data: updatedDoc,
      });
    } catch (error) {
      console.error("Error in updateAuthBanners:", error);
      return res.status(500).json({
        message: "500! Internal Server Error!",
        error: error.message || "An unexpected error occurred.",
      });
    }
  },
];

exports.getAuthBanners = async (req, res) => {
  try {
    let banners = await authBannersModel.findOne();

    if (!banners) {
      // If no banners exist, create default empty banner document
      banners = await authBannersModel.create({
        loginBanner: "",
        registerBanner: "",
        forgotBanner: "",
        otpBanner: "",
      });
    }

    return res.status(200).json(banners);
  } catch (error) {
    console.error("Error in getAuthBanners:", error);
    return res.status(500).json({
      message: "500! Internal Server Error!",
      error: error.message,
    });
  }
};
