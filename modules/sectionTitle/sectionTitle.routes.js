const express = require("express");
const {
  createSectinTitle,
  getAllSectinTitles,
  getSectinTitleById,
  updateSectinTitle,
  deleteSectinTitle,
} = require("./sectionTitle.controllers");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const router = express.Router();

router.post("/", verifyAdmin, createSectinTitle); 
router.get("/", getAllSectinTitles); 
router.get("/:id", getSectinTitleById); 
router.put("/:id", verifyAdmin, updateSectinTitle);
router.delete("/:id", verifyAdmin, deleteSectinTitle);

module.exports = router;
