const express = require("express");
const controller = require("./country.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);

router.delete("/:id", controller.deleteData);

module.exports = router;
