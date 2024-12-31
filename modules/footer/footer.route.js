const express = require("express");
const { footerGet, footerpost, updatefooter, deletefooter } = require("./footer.controller");

const router = express.Router();




router.get('/footerGet', footerGet);
router.post('/footerpost', footerpost);
router.put('/updatefooter', updatefooter);
router.delete('/deletefooter', deletefooter);



module.exports = router;