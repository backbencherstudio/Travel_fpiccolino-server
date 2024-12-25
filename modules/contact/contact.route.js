const express = require("express");
const router = express.Router();
const {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact
  } = require("../contact/contact.controller");

router.post('/createContact', createContact);
router.get('/AllContact', getAllContacts);
router.get('/ContactById/:id', getContactById);
router.delete('/DeleteContact/:id', deleteContact);


module.exports = router;