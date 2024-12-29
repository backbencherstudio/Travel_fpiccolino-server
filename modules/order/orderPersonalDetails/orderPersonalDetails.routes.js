const express = require("express");
const controller = require("./orderPersonalDetails.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.delete("/:id", controller.deleteById);

module.exports = router;
