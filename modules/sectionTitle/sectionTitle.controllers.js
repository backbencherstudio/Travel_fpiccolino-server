const SectinTitle = require("../sectionTitle/sectionTitle.models");

// Create or override
const createSectinTitle = async (req, res) => {
  try {
    const { name, title, description, pageName } = req.body;

    await SectinTitle.findOneAndDelete({ name });

    const newSectinTitle = new SectinTitle({ name, title, description, pageName });
    await newSectinTitle.save();

    res.status(201).json({
      success: true,
      message: "SectinTitle created or updated.",
      data: newSectinTitle,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get all
const getAllSectinTitles = async (req, res) => {
  try {
    const sectinTitles = await SectinTitle.find();
    res.status(200).json({ success: true, data: sectinTitles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching SectinTitles.",
      error: error.message,
    });
  }
};

// Get one by ID
const getSectinTitleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sectinTitle = await SectinTitle.findById(id);

    if (!sectinTitle) {
      return res
        .status(404)
        .json({ success: false, message: "SectinTitle not found." });
    }

    res.status(200).json({ success: true, data: sectinTitle });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Update by ID
const updateSectinTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSectinTitle = await SectinTitle.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedSectinTitle) {
      return res
        .status(404)
        .json({ success: false, message: "SectinTitle not found." });
    }

    res.status(200).json({
      success: true,
      message: "SectinTitle updated.",
      data: updatedSectinTitle,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Delete by ID
const deleteSectinTitle = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSectinTitle = await SectinTitle.findByIdAndDelete(id);

    if (!deletedSectinTitle) {
      return res
        .status(404)
        .json({ success: false, message: "SectinTitle not found." });
    }

    res.status(200).json({
      data: deletedSectinTitle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting SectinTitle.",
      error: error.message,
    });
  }
};

module.exports = {
  createSectinTitle,
  getAllSectinTitles,
  getSectinTitleById,
  updateSectinTitle,
  deleteSectinTitle,
};
