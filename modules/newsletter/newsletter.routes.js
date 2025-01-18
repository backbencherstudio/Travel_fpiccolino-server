const express = require("express");
const { sendNewsletter, createNewsletter, getAllNewsLetter, deleteNewsLetter } = require("./newsletter.controller");

const router = express.Router();

router.get("/send", sendNewsletter);


router.post('/create', createNewsletter)
router.get("/get", getAllNewsLetter)
router.delete("/delete/:id", deleteNewsLetter)
module.exports = router;