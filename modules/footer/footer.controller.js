const Footer = require("../footer/footer.model");
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

exports.footerGet = async (req, res) => {
  try {
    const footer = await Footer.find();
    return res.json(footer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.footerpost = [
  upload.fields([
    { name: "logoImg", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
    { name: "paymentLogos", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const currentFooter = await Footer.findOne();

      const footerData = {
        companyName: req.body.companyName,
        description: req.body.description,
        copyright: req.body.copyright,
        contactInfo: {
          phone: req.body["contactInfo.phone"],
          email: req.body["contactInfo.email"],
        },
        socialLinks: JSON.parse(req.body.socialLinks || "[]"),
      };

      // Handle logo image
      const newLogoImg = req.files?.logoImg?.[0];
      const existingLogoImg = req.body.existingLogoImg;
      const originalLogoImg = req.body.originalLogoImg;

      if (newLogoImg && originalLogoImg) {
        deleteFile(originalLogoImg);
      }

      if (newLogoImg) {
        footerData.logoImg = newLogoImg.path.replace(/^uploads\//, "");
      } else if (existingLogoImg) {
        footerData.logoImg = existingLogoImg.replace(/^uploads\//, "");
      }

      // Handle banner image
      const newBannerImg = req.files?.bannerImg?.[0];
      const existingBannerImg = req.body.existingBannerImg;
      const originalBannerImg = req.body.originalBannerImg;

      if (newBannerImg && originalBannerImg) {
        deleteFile(originalBannerImg);
      }

      if (newBannerImg) {
        footerData.bannerImg = newBannerImg.path.replace(/^uploads\//, "");
      } else if (existingBannerImg) {
        footerData.bannerImg = existingBannerImg.replace(/^uploads\//, "");
      }

      // Handle payment logos
      const existingPaymentLogos = req.body.existingPaymentLogos
        ? JSON.parse(req.body.existingPaymentLogos)
        : [];

      const newPaymentLogos =
        req.files?.paymentLogos?.map((file) =>
          file.path.replace(/^uploads\//, "")
        ) || [];

      // If there are current payment logos, find which ones need to be deleted
      if (currentFooter?.paymentLogos) {
        const logosToKeep = new Set(
          existingPaymentLogos.map((logo) => {
            // Remove base URL and uploads prefix if present
            return logo
              .replace(/^https?:\/\/[^\/]+\//, "")
              .replace(/^uploads\//, "");
          })
        );

        // Delete files that are not in the processed existing logos
        currentFooter.paymentLogos.forEach((oldLogo) => {
          if (!logosToKeep.has(oldLogo)) {
            deleteFile(oldLogo);
          }
        });
      }

      // Combine processed existing logos and new payment logos
      footerData.paymentLogos = [
        ...existingPaymentLogos.map((logo) =>
          logo.replace(/^https?:\/\/[^\/]+\//, "").replace(/^uploads\//, "")
        ),
        ...newPaymentLogos,
      ];

      const updatedFooter = await Footer.findOneAndUpdate(
        {}, // empty filter to update first document
        footerData,
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      );

      console.log("Updated footer:", updatedFooter);
      return res.status(200).json(updatedFooter);
    } catch (error) {
      console.error("Error in footerpost:", error);
      return res.status(500).json({
        message: "500! Internal Server Error!",
        error: error.message || "An unexpected error occurred.",
      });
    }
  },
];

exports.updatefooter = async (req, res) => {
  try {
    const updatedFooter = await Footer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.json(updatedFooter);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Update the delete footer function to clean up files
exports.deletefooter = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);
    if (!footer) {
      return res.status(404).json({ message: "Footer not found" });
    }

    // Delete logo image if exists
    if (footer.logoImg) {
      deleteFile(footer.logoImg);
    }

    // Delete banner image if exists
    if (footer.bannerImg) {
      deleteFile(footer.bannerImg);
    }

    // Delete all payment logos
    if (footer.paymentLogos && footer.paymentLogos.length > 0) {
      footer.paymentLogos.forEach((logo) => {
        deleteFile(logo);
      });
    }

    await Footer.findByIdAndDelete(req.params.id);
    return res.json({
      message: "Footer and associated files deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
