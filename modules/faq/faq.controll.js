const FAQ = require("./faq.model");

const faqController = {
  async upsertFAQ(req, res) {
    try {
      const { category, questions } = req.body;

      // Validate category
      const validCategories = [
        "Booking and Reservations",
        "Travel Experience and Itinerary",
        "Payment and Pricing",
        "Travel Insurance and Safety",
      ];

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      // Find existing FAQ for the category or create new one
      let faq = await FAQ.findOne({ category });

      if (faq) {
        // Update existing FAQ
        faq.questions = questions;
        await faq.save();
      } else {
        // Create new FAQ
        faq = await FAQ.create({
          category,
          questions,
        });
      }

      return res.status(200).json({
        success: true,
        data: faq,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getAllFAQs(req, res) {
    try {
      const faqs = await FAQ.find();
      return res.status(200).json({
        success: true,
        data: faqs,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = faqController;
