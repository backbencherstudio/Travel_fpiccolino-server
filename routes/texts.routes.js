const express = require("express");
const router = express.Router();
const { requireSignin } = require("../controllers/auth"); // Assuming you have auth middleware
const {
  create,
  list,
  read,
  update,
  remove,
  requireAdmin,
} = require("../modules/texts/texts.controll");

router.get("/texts", list);
router.get("/texts/:textId", read);

// Admin only routes
router.post("/texts", requireSignin, requireAdmin, create);
router.put("/texts/:textId", requireSignin, requireAdmin, update);
router.delete("/texts/:textId", requireSignin, requireAdmin, remove);

module.exports = router;
