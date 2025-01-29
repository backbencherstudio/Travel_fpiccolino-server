const Approach = require("./approach.model");
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
    // Clean the file path
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

exports.approachPost = [
  upload.fields([
    { name: "logo1", maxCount: 1 },
    { name: "logo2", maxCount: 1 },
    { name: "logo3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Get current approach data
      const currentApproach = await Approach.findOne();
      console.log("Current approach data:", currentApproach);

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
          console.log(`Deleting original logo at position ${i}:`, originalLogo);
          deleteFile(originalLogo);
        }

        // Add logo data to array if there's any data for this position
        if (newLogo || existingLogo || name || description) {
          updatedLogos.push({
            logo: newLogo ? newLogo.path : existingLogo || "",
            name: name || "",
            description: description || "",
          });
        }
      }

      // Find logos that are no longer used and delete them
      if (currentApproach && currentApproach.logos) {
        currentApproach.logos.forEach((oldLogo) => {
          const isLogoKept = updatedLogos.some(
            (newLogo) => newLogo.logo === oldLogo.logo
          );
          if (!isLogoKept && oldLogo.logo) {
            console.log("Deleting unused logo:", oldLogo.logo);
            deleteFile(oldLogo.logo);
          }
        });
      }

      console.log("Processing updated logos:", updatedLogos);

      const updatedApproach = await Approach.findOneAndUpdate(
        {}, // empty filter to update first document
        { logos: updatedLogos },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      );

      console.log("Updated approach:", updatedApproach);
      return res.status(200).json(updatedApproach);
    } catch (error) {
      console.error("Error in approachPost:", error);
      return res.status(500).json({
        message: "500! Internal Server Error!",
        error: error.message || "An unexpected error occurred.",
      });
    }
  },
];

exports.getApproach = async (req, res) => {
  try {
    const approach = await Approach.findOne();
    if (!approach) {
      return res.status(404).json({
        message: "No approach data found",
      });
    }
    return res.status(200).json(approach);
  } catch (error) {
    console.error("Error in getApproach:", error);
    return res.status(500).json({
      message: "500! Internal Server Error!",
      error: error.message || "An unexpected error occurred.",
    });
  }
};
