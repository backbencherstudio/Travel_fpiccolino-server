const {
  getImageUrl,
  updateImageUrl,
  baseUrl,
} = require("../../util/image_path");
const Package = require("./package.model");

const createPackage = async (req, res) => {
  try {
    const packageData = req.body;
    let images = [];
    let hotelImages = [];

    if (req.files) {
      // Extract images from the `images` field
      if (req.files.images) {
        images = req.files.images.map((file) => `/uploads/${file.filename}`);
      }

      // Extract hotel images from the `hotelImages` field
      if (req.files.hotelImages) {
        hotelImages = req.files.hotelImages.map(
          (file) => `/uploads/${file.filename}`
        );
      }
    }

    // Parse JSON fields that are sent as strings
    if (packageData.tourDuration) {
      packageData.tourDuration = JSON.parse(packageData.tourDuration);
    }
    if (packageData.includeItems) {
      packageData.includeItems = JSON.parse(packageData.includeItems);
    }
    if (packageData.notIncludeItems) {
      packageData.notIncludeItems = JSON.parse(packageData.notIncludeItems);
    }
    if (packageData.bookedFlights) {
      packageData.bookedFlights = JSON.parse(packageData.bookedFlights);
    }
    if (packageData.insurance) {
      packageData.insurance = JSON.parse(packageData.insurance);
    }

    // Assign processed images to package data
    packageData.hotelImages = hotelImages;
    packageData.images = images;

    const newPackage = new Package(packageData);
    await newPackage.save();

    res.status(201).json({
      message: "Package created successfully",
      package: {
        ...newPackage.toObject(),
        imageUrl: newPackage?.images?.map((path) => getImageUrl(path)),
        hotelImageUrls: newPackage?.hotelImages?.map((path) =>
          getImageUrl(path)
        ),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create package",
      error,
    });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("country")
      .sort({ createdAt: -1 });

    const formattedPackages = packages.map((packageItem) => ({
      ...packageItem.toObject(),
      images: packageItem?.images?.map(
        (path) => `${process.env.APP_URL}${path}`
      ),
      hotelImages: packageItem?.hotelImages?.map(
        (path) => `${process.env.APP_URL}${path}`
      ),
    }));

    res.status(200).json({
      message: "Packages fetched successfully",
      packages: formattedPackages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching packages",
      error: error.message,
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const packageId = req.params.id;
    const package = await Package.findById(packageId).populate("country");

    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Add image URLs to the package
    const formattedPackage = {
      ...package.toObject(),
      images: package?.images?.map((path) => {
        return path;
      }),
      hotelImages: package?.hotelImages.map((path) => {
        return path;
      }),
    };

    res.status(200).json(formattedPackage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching package", error: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updatedData = req.body;

    let images = [];
    let hotelImages = [];
    if (req.files) {
      if (req.files.images) {
        req.files.images.forEach((file) => {
          images.push(`/uploads/${file.filename}`);
        });
      }
      if (req.files.hotelImages) {
        req.files.hotelImages.forEach((file) => {
          hotelImages.push(`/uploads/${file.filename}`);
        });
      }
    }
    const existingImages = updatedData.existingImages || [];
    const existingHotelImages = updatedData.existingHotelImages || [];

    updatedData.images = [...existingImages, ...images];
    updatedData.hotelImages = [...existingHotelImages, ...hotelImages];

    const parseJsonField = (field) => {
      try {
        if (typeof field === "string") {
          return JSON.parse(field);
        }
        return field;
      } catch (error) {
        return field;
      }
    };

    const filterItems = (items) => {
      const seenTexts = new Set();
      return items.filter((item) => {
        if (!item.name || seenTexts.has(item.text)) {
          return false;
        }
        seenTexts.add(item.text);
        return true;
      });
    };

    if (updatedData.tourDuration) {
      updatedData.tourDuration = parseJsonField(updatedData.tourDuration);
    }
    if (updatedData.includeItems) {
      console.log(updatedData.includeItems);
      const parsedIncludeItems = parseJsonField(updatedData.includeItems);
      updatedData.includeItems = filterItems(parsedIncludeItems); // Filter items
    }
    if (updatedData.notIncludeItems) {
      console.log(updatedData.notIncludeItems);
      const parsedNotIncludeItems = parseJsonField(updatedData.notIncludeItems);
      updatedData.notIncludeItems = filterItems(parsedNotIncludeItems); // Filter items
    }
    if (updatedData.bookedFlights) {
      updatedData.bookedFlights = parseJsonField(updatedData.bookedFlights);
    }
    if (updatedData.insurance) {
      updatedData.insurance = parseJsonField(updatedData.insurance);
    }
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      updatedData,
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({
      message: "Package updated successfully",
      package: {
        ...updatedPackage.toObject(),
        images: updatedPackage?.images?.map((path) => getImageUrl(path)),
        hotelImages: updatedPackage?.hotelImages?.map((path) =>
          getImageUrl(path)
        ),
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Error updating package", error: error.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const deletedPackage = await Package.findByIdAndDelete(packageId);
    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting package", error: error.message });
  }
};

const searchPackages = async (req, res) => {
  try {
    const { q } = req.query;
    const packages = await Package.find({
      $or: [
        { tourName: { $regex: q, $options: "i" } },
        { tourDescription: { $regex: q, $options: "i" } },
      ],
    });

    const formattedPackages = packages.map((packageItem) => ({
      ...packageItem.toObject(),
      imageUrl: packageItem?.images?.map(
        (path) => `${process.env.APP_URL}${path}`
      ),
    }));

    res.status(200).json({
      message: "Packages fetched successfully",
      packages: formattedPackages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching packages",
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
