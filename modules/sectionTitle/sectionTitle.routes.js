const express = require("express");
const {
  createSectinTitle,
  getAllSectinTitles,
  getSectinTitleById,
  updateSectinTitle,
  deleteSectinTitle,
} = require("./sectionTitle.controllers");

const router = express.Router();

router.post("/", createSectinTitle); 
router.get("/", getAllSectinTitles); 
router.get("/:id", getSectinTitleById); 
router.put("/:id", updateSectinTitle); 
router.delete("/:id", deleteSectinTitle);

module.exports = router;
