const express = require("express");
const { footerGet, footerpost, updatefooter, deletefooter } = require("./footer.controller");
const { verifyAdmin } = require("../../middleware/verifyAdmin");

const router = express.Router();




router.get('/footerGet', footerGet);
router.post('/footerpost', verifyAdmin, footerpost);
router.put('/updatefooter', verifyAdmin, updatefooter);
router.delete('/deletefooter', deletefooter);



module.exports = router;