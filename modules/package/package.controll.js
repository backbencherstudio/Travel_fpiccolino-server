const { getImageUrl } = require("../../util/image_path");
const Package = require("./package.model");

const createPackage = async (req, res) => {
  // console.log(req.body)
  // console.log(req.files);

  try {
    const packageData = req.body;

    if (req.files && req.files.length > 0) {
      packageData.images = req.files.map((file) => `/uploads/${file.filename}`);
    } else {
      packageData.images = [];
    }

    console.log(packageData);
    const newPackage = new Package(packageData);
    await newPackage.save();

    // res.send(newPackage);

    res.status(201).json({
      message: "Package created successfully",
      package: {
        ...newPackage.toObject(),
        imageUrl: newPackage.images.map((path) => getImageUrl(path)),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching packages",
      error: error.message,
    });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate("country");

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
      imageUrl: package?.images?.map((path) => getImageUrl(path)),
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
        images = req.files.images.map((file) => `/uploads/${file.filename}`);
      }

      if (req.files.hotelImages) {
        hotelImages = req.files.hotelImages.map(
          (file) => `/uploads/${file.filename}`
        );
      }
    }

    if (updatedData.tourDuration) {
      updatedData.tourDuration = JSON.parse(updatedData.tourDuration);
    }
    if (updatedData.includeItems) {
      updatedData.includeItems = JSON.parse(updatedData.includeItems);
    }
    if (updatedData.notIncludeItems) {
      updatedData.notIncludeItems = JSON.parse(updatedData.notIncludeItems);
    }
    if (updatedData.bookedFlights) {
      updatedData.bookedFlights = JSON.parse(updatedData.bookedFlights);
    }
    if (updatedData.insurance) {
      updatedData.insurance = JSON.parse(updatedData.insurance);
    }

    if (images.length > 0) {
      updatedData.images = images;
    }
    if (hotelImages.length > 0) {
      updatedData.hotelImages = hotelImages;
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
        imageUrl: updatedPackage?.images?.map((path) => getImageUrl(path)),
        hotelImageUrls: updatedPackage?.hotelImages?.map((path) =>
          getImageUrl(path)
        ),
      },
    });
  } catch (error) {
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
