const express = require("express");
const {
  createShorts,
  getAllShorts,
  getShortById,
  updateShort,
  deleteShort,
} = require("./short.controller");
const { verifyAdmin } = require("../../middleware/verifyAdmin");
const router = express.Router();

router.post("/", verifyAdmin, createShorts);

router.get("/", getAllShorts);

router.get("/:id", getShortById);

router.put("/:id", verifyAdmin, updateShort);

router.delete("/:id", verifyAdmin, deleteShort);

module.exports = router;
