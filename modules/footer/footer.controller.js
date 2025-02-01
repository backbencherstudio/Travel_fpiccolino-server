const Footer = require("../footer/footer.model");

exports.footerGet = async (req, res) => {
  try {
    const footer = await Footer.find();
    return res.json(footer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
exports.footerpost = [
  upload.fields([
    { name: "logoImg", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
    { name: "paymentLogos", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const footerData = {
        companyName: req.body.companyName,
        description: req.body.description,
        copyright: req.body.copyright,
        contactInfo: {
          phone: req.body["contactInfo.phone"],
          email: req.body["contactInfo.email"],
        },
      };

      // Add logo path if a logo file was uploaded
      if (req.files && req.files.logoImg && req.files.logoImg[0]) {
        footerData.logoImg = req.files.logoImg[0].path;
      }

      // Add banner path if a banner file was uploaded
      if (req.files && req.files.bannerImg && req.files.bannerImg[0]) {
        footerData.bannerImg = req.files.bannerImg[0].path;
      }

      // Handle payment logos
      const existingPaymentLogos = req.body.existingPaymentLogos
        ? JSON.parse(req.body.existingPaymentLogos)
        : [];

      // Get paths of newly uploaded payment logos
      const newPaymentLogos =
        req.files?.paymentLogos?.map((file) => file.path) || [];

      // Process existing payment logos to remove base URL and 'uploads/' prefix
      const processedExistingLogos = existingPaymentLogos.map((logo) => {
        // Remove base URL if present
        const withoutBaseUrl = logo.replace(/^https?:\/\/[^\/]+\//, "");
        // Remove 'uploads/' prefix if present
        return withoutBaseUrl.replace(/^uploads\//, "");
      });

      // Combine processed existing logos and new payment logos
      footerData.paymentLogos = [
        ...processedExistingLogos,
        ...newPaymentLogos.map((path) => path.replace(/^uploads\//, "")),
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

exports.deletefooter = async (req, res) => {
  try {
    await Footer.findByIdAndDelete(req.params.id);
    return res.json({ message: "Footer deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
