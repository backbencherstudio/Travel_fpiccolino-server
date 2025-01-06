const express = require("express");
const router = express.Router();
const {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact
  } = require("../contact/contact.controller");
const { verifyUser } = require("../../middleware/verifyUser");

router.post('/createContact', verifyUser, createContact);
router.get('/AllContact', getAllContacts);
router.get('/ContactById/:id', getContactById);
router.delete('/DeleteContact/:id', verifyUser, deleteContact);


module.exports = router;