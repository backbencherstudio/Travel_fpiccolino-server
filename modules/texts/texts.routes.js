const express = require("express");
const textController = require("./texts.controll");
const router = express.Router();

router.get("/", textController.getAllTexts);
router.put("/", textController.upsertText);

module.exports = router;
