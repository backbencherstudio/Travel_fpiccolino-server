const express = require("express");
const {
  createShorts,
  getAllShorts,
  getShortById,
  updateShort,
  deleteShort,
} = require("./short.controller");
const router = express.Router();

router.post("/", createShorts);

router.get("/", getAllShorts);

router.get("/:id", getShortById);

router.put("/:id", updateShort);

router.delete("/:id", deleteShort);

module.exports = router;
