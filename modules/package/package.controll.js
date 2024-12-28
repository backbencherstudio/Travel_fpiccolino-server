const { getImageUrl } = require("../../util/image_path");
const Package = require("./package.model");

// const createPackage = async (req, res) => {
//   try {
//     const packageData = req.body;
//     let images = [];
//     if (req.files && req.files.length > 0) {
//       images = req.files.map((file) => `/uploads/${file.filename}`); // Correctly map the file paths
//     }

//     packageData.images = images;
//     console.log(18,packageData);

//     // Create a new package instance
//     const newPackage = new Package(packageData);
//     await newPackage.save();
//   res.send("done")
//     // res.status(201).json({
//     //   message: "Package created successfully",
//     //   package: {
//     //     ...newPackage.toObject(),
//     //     imageUrl: newPackage?.images?.map((path) => getImageUrl(path)),
//     //   },
//     // });
//   } catch (error) {
//     res.status(400).json({
//       message: "Error creating package",
//       error: error.message,
//     });
//   }
// };

// const createPackage = async (req, res) => {
//   try {
//     const packageData = req.body;

//     console.log(8, packageData);

//     // // Handle images
//     // if (req.files && req.files.length > 0) {
//     //   packageData.imageUrl = req.files.map(
//     //     (file) => `/uploads/${file.filename}`
//     //   );
//     // } else {
//     //   packageData.imageUrl = [];
//     // }

//     // Save the package to the database
//     // const newPackage = new Package(packageData);
//     // await newPackage.save();

//     // res.status(201).json({
//     //   message: "Package created successfully",
//     //   package: {
//     //     ...newPackage.toObject(),
//     //     imageUrl: newPackage.imageUrl.map((path) => `${process.env.APP_URL}${path}`),
//     //   },
//     // });
//   } catch (error) {
//     res.status(400).json({
//       message: "Error creating package",
//       error: error.message,
//     });
//   }
// };

const createPackage = async (req, res) => {
  console.log(70, req.body);
  try {
    const packageData = req.body;
    let images = [];

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
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
    packageData.images = images;
    const newPackage = new Package(packageData);
    await newPackage.save();

    res.status(201).json({
      message: "Package created successfully",
      package: {
        ...newPackage.toObject(),
        imageUrl: newPackage?.images?.map((path) => getImageUrl(path)),
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating package",
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
      package: updatedPackage,
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

module.exports = {
  createPackage,
  getPackageById,
  getAllPackages,
  updatePackage,
  deletePackage,
};
