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
    { name: "sideImage", maxCount: 1 },
    { name: "logo1", maxCount: 1 },
    { name: "logo2", maxCount: 1 },
    { name: "logo3", maxCount: 1 },
    // Add dynamic company logo fields
    ...Array.from({ length: 20 }, (_, i) => ({
      name: `companyLogo${i}`,
      maxCount: 1,
    })),
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

      // Handle side image
      const newSideImage = req.files?.sideImage?.[0];
      const existingSideImage = req.body.existingSideImage;
      const originalSideImage = req.body.originalSideImage;

      if (newSideImage && originalSideImage) {
        deleteFile(originalSideImage);
      }

      const sideImage = newSideImage
        ? newSideImage.path
        : existingSideImage || "";

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

      // Get the list of company logos to be retained
      const retainedCompanyLogos = new Set();
      const companiesCount = parseInt(req.body.companiesCount) || 0;

      // Add all existing/new company logos that should be retained
      for (let i = 0; i < companiesCount; i++) {
        const existingCompanyLogo = req.body[`existingCompanyLogo${i}`];
        if (existingCompanyLogo) {
          retainedCompanyLogos.add(existingCompanyLogo);
        }
      }

      // Delete files for removed companies
      if (currentWhyUs && currentWhyUs.companies) {
        currentWhyUs.companies.forEach((company) => {
          if (
            company.companyLogo &&
            !retainedCompanyLogos.has(company.companyLogo) &&
            company.companyLogo !== "placeholder.jpg"
          ) {
            deleteFile(company.companyLogo);
          }
        });
      }

      // Rest of your existing code for handling companies
      const updatedCompanies = [];
      for (let i = 0; i < companiesCount; i++) {
        const existingCompanyLogo = req.body[`existingCompanyLogo${i}`];
        const originalCompanyLogo = req.body[`companyOriginalLogo${i}`];
        const newCompanyLogo = req.files?.[`companyLogo${i}`]?.[0];
        const companyName = req.body[`companyName${i}`];

        // Delete old company logo if new one is uploaded
        if (newCompanyLogo && originalCompanyLogo) {
          deleteFile(originalCompanyLogo);
        }

        // Only add company if we have either a name or logo
        if (companyName || newCompanyLogo || existingCompanyLogo) {
          updatedCompanies.push({
            companyLogo: newCompanyLogo
              ? newCompanyLogo.path
              : existingCompanyLogo || "",
            companyName: companyName || "",
          });
        }
      }

      // Update the document
      const updatedWhyUs = await WhyUs.findOneAndUpdate(
        {},
        {
          bannerImage,
          sideImage,
          logos:
            updatedLogos.length > 0 ? updatedLogos : currentWhyUs?.logos || [],
          companies:
            updatedCompanies.length > 0
              ? updatedCompanies
              : currentWhyUs?.companies || [],
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
