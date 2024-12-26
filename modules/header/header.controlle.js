const { getImageUrl } = require("../../util/image_path");
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
      const header = await Header.findOne({ pageName: req.params.pageName }); // Query using pageName
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

  console.log("hit");
  

    console.log( 29, req.body);
    console.log( 30, req.file);
  
    try {
      const headerData = req.body;  
      if (headerData?.pageName) {
        await Header.findOneAndDelete({ pageName: headerData.pageName });
      }
      if (req.file) {
        headerData.image = `/uploads/${req.file.filename}`;
      } else {
        headerData.image = null; 
      }

      const newHeader = new Header(headerData);
      await newHeader.save();

      res.status(201).json({
        message: "header created successfully",
        package: {
          ...newHeader.toObject(),
          imageUrl: getImageUrl(newHeader.image) 
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating package",
        error: error.message,
      });
    }
  };



  const updateHeader = async (req, res) => {
    try {
      const headerData = req.body;
  
      if (req.file) {
        headerData.image = `/uploads/${req.file.filename}`;
      }
  
      const updatedHeader = await Header.findOneAndUpdate(
        { pageName: headerData.pageName }, 
        headerData, 
        { new: true, runValidators: true } 
      );
  
      if (!updatedHeader) {
        return res.status(404).json({
          message: "Header not found for the given pageName",
        });
      }
  
      res.status(200).json({
        message: "Header updated successfully",
        header: {
          ...updatedHeader.toObject(),
          imageUrl: getImageUrl(updatedHeader.image),
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Error updating header",
        error: error.message,
      });
    }
  };
  

const deleteHeader = async (req, res) => {
  try {
    const deletedHeader = await Header.findOneAndDelete({ pageName: req.params.pageName }); 
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
