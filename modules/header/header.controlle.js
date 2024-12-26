const Header = require("./header.modls");

const getAllHeaders = async (req, res) => {
  try {
    const headers = await Header.find();
    res.status(200).json(headers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHeader = async (req, res) => {
  try {
    const header = await Header.findById(req.params.id);
    if (!header) {
      return res.status(404).json({ message: "Header not found" });
    }
    res.status(200).json(header);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new header
const createHeader = async (req, res) => {
  try {
    const { pageName } = req.body;

    // Check if a document with the same pageName exists
    await Header.findOneAndDelete({ pageName });


  
    const newHeader = new Header(req.body);
    if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
      }
    const savedHeader = await newHeader.save();

    res.status(201).json(savedHeader);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateHeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { pageName } = req.body;

    const existingHeader = await Header.findOne({ pageName, _id: { $ne: id } });
    if (existingHeader) {
      await Header.findByIdAndDelete(existingHeader._id);
    }

    const updatedHeader = await Header.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedHeader) {
      return res.status(404).json({ message: "Header not found" });
    }

    res.status(200).json(updatedHeader);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteHeader = async (req, res) => {
  try {
    const deletedHeader = await Header.findByIdAndDelete(req.params.id);
    if (!deletedHeader) {
      return res.status(404).json({ message: "Header not found" });
    }
    res.status(200).json({ message: "Header deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllHeaders,
  getHeader,
  createHeader,
  updateHeader,
  deleteHeader,
};
