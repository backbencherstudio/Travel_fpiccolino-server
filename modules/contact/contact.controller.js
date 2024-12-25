const Contact  = require("./contact.model");

exports.createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, contactMethod, message } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !contactMethod || !message) {
            return res.status(400).json({ error: 'All required fields must be filled!' });
        }

        const newContact = new Contact ({
            firstName,
            lastName,
            email,
            phone,
            contactMethod,
            message
        });

        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a single contact by ID
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};