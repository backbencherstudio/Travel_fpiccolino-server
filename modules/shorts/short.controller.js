const Shorts = require("./short.model");

// Create Shorts
exports.createShorts = async (req, res) => {
  try {
    const { url, countryId } = req.body;
    console.log("Request body:", { url, countryId });

    if (!url || !countryId) {
      return res
        .status(400)
        .json({ message: "URL and Country ID are required" });
    }

    const shorts = await Shorts({ url, countryId });
    const result = await shorts.save();

    res.status(201).json({
      message: "Shorts created successfully",
      short: result,
    });
  } catch (error) {
    console.error("Create shorts error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get All Shorts
exports.getAllShorts = async (req, res) => {
  try {
    const shorts = await Shorts.find()
      .sort({ createdAt: -1 })
      .populate("countryId", "name"); // Optionally populate country details
    res.status(200).json({ message: "Shorts fetched successfully", shorts });
  } catch (error) {
    console.error("Get all shorts error:", error);
    res
      .status(500)
      .json({ message: "Error fetching shorts", error: error.message });
  }
};

// Get Short by ID
exports.getShortById = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await Shorts.findById(shortId);

    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }

    res.status(200).json({
      message: "Short fetched successfully",
      short,
    });
  } catch (error) {
    console.error("Get short by ID error:", error);
    res
      .status(500)
      .json({ message: "Error fetching short", error: error.message });
  }
};

// Update Short
const mongoose = require("mongoose");

exports.updateShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { url, countryId } = req.body;

    if (!mongoose.isValidObjectId(shortId)) {
      return res.status(400).json({ message: "Invalid Short ID" });
    }

    if (!url || !countryId) {
      return res
        .status(400)
        .json({ message: "URL and Country ID are required to update" });
    }

    const updatedShort = await Shorts.findByIdAndUpdate(
      shortId,
      { url, countryId },
      { new: true }
    ).populate("countryId", "name");

    if (!updatedShort) {
      return res.status(404).json({ message: "Short not found" });
    }

    res.status(200).json({
      message: "Short updated successfully",
      short: updatedShort,
    });
  } catch (error) {
    console.error("Update short error:", error);
    res
      .status(500)
      .json({ message: "Error updating short", error: error.message });
  }
};

// Delete Short
exports.deleteShort = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("shortId", req.params);

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Short ID" });
    }

    const deletedShort = await Shorts.findByIdAndDelete(id);

    if (!deletedShort) {
      return res.status(404).json({ message: "Short not found" });
    }

    res.status(200).json({ message: "Short deleted successfully" });
  } catch (error) {
    console.error("Delete short error:", error);
    res
      .status(500)
      .json({ message: "Error deleting short", error: error.message });
  }
};
