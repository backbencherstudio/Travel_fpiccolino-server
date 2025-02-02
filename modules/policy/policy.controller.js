const Policy = require("./policy.model");

const policyController = {
  async upsertPolicy(req, res) {
    try {
      const { category, content } = req.body;

      // Validate category
      const validCategories = [
        "Candidate information",
        "Newsletter information",
        "Website privacy policy",
        "Purchase information",
        "Categories responsible for processing",
        "Privacy Area",
        "Appointment Request Information",
        "Gift Card Information",
      ];

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      // Find existing policy for the category or create new one
      let policy = await Policy.findOne({ category });

      if (policy) {
        // Update existing policy
        policy.content = content;
        await policy.save();
      } else {
        // Create new policy
        policy = await Policy.create({
          category,
          content,
        });
      }

      return res.status(200).json({
        success: true,
        data: policy,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getAllPolicies(req, res) {
    try {
      const policies = await Policy.find();
      return res.status(200).json({
        success: true,
        data: policies,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getPolicyByCategory(req, res) {
    try {
      const { category } = req.params;
      const policy = await Policy.findOne({ category });

      if (!policy) {
        return res.status(404).json({
          success: false,
          message: "Policy not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: policy,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = policyController;
