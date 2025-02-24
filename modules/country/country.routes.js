const express = require("express");
const controller = require("./country.controller");

const router = express.Router();

const { upload } = require("../../middleware/Multer.config");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

router.get("/", controller.getAll);
router.post("/", upload.single("image"), controller.create);
router.get("/:id", controller.getOne);
router.put("/:id", upload.single("image"), controller.update);

router.delete("/:id", verifyAdmin, controller.deleteData);

module.exports = router;
