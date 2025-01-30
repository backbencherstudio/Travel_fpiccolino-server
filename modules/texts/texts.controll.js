const Text = require("./texts.model");

const textController = {
  // Get all texts
  async getAllTexts(req, res) {
    try {
      const texts = await Text.find();
      return res.status(200).json({
        success: true,
        data: texts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Update or create text
  async upsertText(req, res) {
    try {
      const { key, value } = req.body;
      console.log("Upsert request received:", { key, value });

      if (!key || !value) {
        return res.status(400).json({
          success: false,
          message: "Both key and value are required",
        });
      }

      // Try to find existing text by key
      let text = await Text.findOne({ key });

      if (text) {
        // Update existing text
        text.value = value;
        await text.save();
        console.log("Updated existing text:", text);
      } else {
        // Create new text
        text = await Text.create({
          key,
          value,
        });
        console.log("Created new text:", text);
      }

      return res.status(200).json({
        success: true,
        data: text,
        message: text.isNew ? "Text created" : "Text updated",
      });
    } catch (error) {
      console.error("Error in upsertText:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Middleware to check if user is admin
  requireAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
  },
};

module.exports = textController;
