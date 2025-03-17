const { log } = require("console");
const {
  getImageUrl,
  updateImageUrl,
  baseUrl,
} = require("../../util/image_path");
const Package = require("./package.model");
const fs = require("fs").promises;
const path = require("path");

// Utility Functions
const processImages = (files, type) => {
  if (!files || !files[type]) return [];
  return files[type].map((file) => `/uploads/${file.filename}`);
};

const parseJsonSafely = (field) => {
  if (!field) return field;
  try {
    return typeof field === "string" ? JSON.parse(field) : field;
  } catch (error) {
    return field;
  }
};

const filterDuplicateItems = (items) => {
  if (!Array.isArray(items)) return [];
  const seenTexts = new Set();
  return items.filter((item) => {
    if (!item?.name || !item?.text || seenTexts.has(item.text)) {
      return false;
    }
    seenTexts.add(item.text);
    return true;
  });
};

const cleanupImages = async (imagePaths) => {
  for (const imagePath of imagePaths) {
    try {
      const fullPath = path.join(__dirname, "../..", imagePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete image: ${imagePath}`, error);
    }
  }
};

const processPackageData = (data) => {
  const fieldsToProcess = {
    tourDuration: false,
    includeItems: true,
    notIncludeItems: true,
    bookedFlights: false,
    insurance: false,
  };

  const processed = { ...data };
  for (const [field, shouldFilter] of Object.entries(fieldsToProcess)) {
    if (processed[field]) {
      const parsedField = parseJsonSafely(processed[field]);
      processed[field] = shouldFilter
        ? filterDuplicateItems(parsedField)
        : parsedField;
    }
  }
  return processed;
};

// Controllers
const createPackage = async (req, res) => {
  try {
    const packageData = processPackageData(req.body);

    // Process images
    packageData.images = processImages(req.files, "images");
    packageData.hotelImages = processImages(req.files, "hotelImages");

    const newPackage = new Package(packageData);
    await newPackage.save();

    res.status(201).json({
      message: "Package created successfully",
      package: {
        ...newPackage.toObject(),
        imageUrl: newPackage.images?.map(getImageUrl),
        hotelImageUrls: newPackage.hotelImages?.map(getImageUrl),
      },
    });
  } catch (error) {
    console.error("Create package error:", error);
    res.status(500).json({
      message: "Failed to create package",
      error: error.message,
    });
  }
};

const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updatedData = req.body;

    // const imageUpdate = req.body.imageUrl;

    // Get existing package
    const existingPackage = await Package.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Process new images
    const newImages = processImages(req.files, "images");
    const newHotelImages = processImages(req.files, "hotelImages");

    // Get existing images
    const existingImages = Array.isArray(updatedData.existingImages)
      ? updatedData.existingImages
      : [];
    const existingHotelImages = Array.isArray(updatedData.existingHotelImages)
      ? updatedData.existingHotelImages
      : [];

    // Combine and deduplicate images
    updatedData.images = [...new Set([...existingImages, ...newImages])];
    updatedData.hotelImages = [
      ...new Set([...existingHotelImages, ...newHotelImages]),
    ];

    // Find images to delete
    const imagesToDelete = existingPackage.images.filter(
      (img) => !updatedData.images.includes(img)
    );
    const hotelImagesToDelete = existingPackage.hotelImages.filter(
      (img) => !updatedData.hotelImages.includes(img)
    );

    // Process other fields
    const processedData = processPackageData(updatedData);

    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      processedData,
      { new: true }
    );

    // Clean up deleted images
    await cleanupImages([...imagesToDelete, ...hotelImagesToDelete]);

    res.status(200).json({
      message: "Package updated successfully",
      package: {
        ...updatedPackage.toObject(),
        imageUrl: updatedPackage.images?.map((path) => path),
        hotelImageUrls: updatedPackage.hotelImages?.map((path) => path),
      },
    });
  } catch (error) {
    console.error("Update package error:", error);
    res.status(400).json({
      message: "Error updating package",
      error: error.message,
    });
  }
};

const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    const packageToDelete = await Package.findById(packageId);
    if (!packageToDelete) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Delete associated images first
    const allImages = [
      ...(packageToDelete.images || []),
      ...(packageToDelete.hotelImages || []),
    ];
    await cleanupImages(allImages);

    // Delete the package
    await Package.findByIdAndDelete(packageId);

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Delete package error:", error);
    res.status(500).json({
      message: "Error deleting package",
      error: error.message,
    });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const queryConditions = [];

    if (search) {
      queryConditions.push({
        $or: [
          { destination: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
        ],
      });
    }
    if (start) {
      queryConditions.push({
        createdAt: { $gte: start },
      });
    }
    if (end) {
      queryConditions.push({
        createdAt: { $lte: end },
      });
    }
    const packages = queryConditions.length
      ? await Package.find({ $and: queryConditions })
          .populate("country")
          .sort({ createdAt: -1 })
      : await Package.find().populate("country").sort({ createdAt: -1 });

    const formattedPackages = packages.map((packageItem) => ({
      ...packageItem.toObject(),
      images: packageItem.images?.map(
        (path) => `${process.env.APP_URL}${path}`
      ),
      hotelImages: packageItem.hotelImages?.map(
        (path) => `${process.env.APP_URL}${path}`
      ),
    }));

    res.status(200).json({
      message: "Packages fetched successfully",
      packages: formattedPackages,
    });
  } catch (error) {
    console.error("Get all packages error:", error);
    res.status(500).json({
      message: "Error fetching packages",
      error: error.message,
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const packageId = req.params.id;
    const package = await Package.findById(packageId)
      .populate("country")
      .sort({ createdAt: -1 });

    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    const formattedPackage = {
      ...package.toObject(),
      images: package.images?.map((path) => path),
      hotelImages: package.hotelImages?.map((path) => path),
    };

    res.status(200).json(formattedPackage);
  } catch (error) {
    console.error("Get package by ID error:", error);
    res.status(500).json({
      message: "Error fetching package",
      error: error.message,
    });
  }
};

const searchPackages = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const packages = await Package.find({
      $or: [
        { tourName: { $regex: q, $options: "i" } },
        { tourDescription: { $regex: q, $options: "i" } },
      ],
    });

    const formattedPackages = packages.map((packageItem) => ({
      ...packageItem.toObject(),
      imageUrl: packageItem.images?.map(
        (path) => `${process.env.APP_URL}${path}`
      ),
    }));

    res.status(200).json({
      message: "Packages fetched successfully",
      packages: formattedPackages,
    });
  } catch (error) {
    console.error("Search packages error:", error);
    res.status(500).json({
      message: "Error searching packages",
      error: error.message,
    });
  }
};

module.exports = {
  createPackage,
  getPackageById,
  getAllPackages,
  updatePackage,
  deletePackage,
  searchPackages,
};
