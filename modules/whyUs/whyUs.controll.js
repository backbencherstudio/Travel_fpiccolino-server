const WhyUs = require("./whyUs.model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
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

exports.whyUsPost = [
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "logo1", maxCount: 1 },
    { name: "logo2", maxCount: 1 },
    { name: "logo3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const currentWhyUs = await WhyUs.findOne();

      // Handle banner image
      const newBannerImage = req.files?.bannerImage?.[0];
      const existingBannerImage = req.body.existingBannerImage;
      const originalBannerImage = req.body.originalBannerImage;

      if (newBannerImage && originalBannerImage) {
        deleteFile(originalBannerImage);
      }

      const bannerImage = newBannerImage
        ? newBannerImage.path
        : existingBannerImage || "";

      const updatedLogos = [];

      // Process each logo position (1-3)
      for (let i = 1; i <= 3; i++) {
        const existingLogo = req.body[`existingLogo${i}`];
        const originalLogo = req.body[`originalLogo${i}`];
        const newLogo = req.files?.[`logo${i}`]?.[0];
        const name = req.body[`name${i}`];
        const description = req.body[`description${i}`];

        // If there's a new logo and an original logo path, delete the old file
        if (newLogo && originalLogo) {
          deleteFile(originalLogo);
        }

        // Only add logo if we have either a new logo or an existing one
        const logoPath = newLogo ? newLogo.path : existingLogo;

        // Skip empty logos
        if (name || description || logoPath) {
          updatedLogos.push({
            logo:
              logoPath || currentWhyUs?.logos[i - 1]?.logo || "placeholder.jpg", // Provide a default or existing logo
            name: name || "",
            description: description || "",
          });
        }
      }

      // Update the document
      const updatedWhyUs = await WhyUs.findOneAndUpdate(
        {},
        {
          bannerImage,
          logos:
            updatedLogos.length > 0 ? updatedLogos : currentWhyUs?.logos || [],
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      );

      return res.status(200).json(updatedWhyUs);
    } catch (error) {
      console.error("Error in whyUsPost:", error);
      return res.status(500).json({
        message: "500! Internal Server Error!",
        error: error.message || "An unexpected error occurred.",
      });
    }
  },
];

exports.getWhyUs = async (req, res) => {
  try {
    const whyUs = await WhyUs.findOne();
    if (!whyUs) {
      return res.status(404).json({
        message: "No why us data found",
      });
    }
    return res.status(200).json(whyUs);
  } catch (error) {
    console.error("Error in getWhyUs:", error);
    return res.status(500).json({
      message: "500! Internal Server Error!",
      error: error.message || "An unexpected error occurred.",
    });
  }
};
