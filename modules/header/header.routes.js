import express from "express";
import {
  getAllHeaders,
  getHeader,
  createHeader,
  updateHeader,
  deleteHeader,
} from "./header.controlle";
const { upload } = require("../../middleware/Multer.config");

const router = express.Router();

router.get("/", getAllHeaders);
router.get("/:id", getHeader);
router.post("/", upload.single("image"), createHeader);
router.put("/:id", upload.single("image"), updateHeader);
router.delete("/:id", deleteHeader);

export default router;
