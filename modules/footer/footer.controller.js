
const Footer = require("../footer/footer.model");


exports.footerGet = async (req, res) => {
    try {
      const footer = await Footer.find();
      return res.json(footer);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.footerpost = async (req, res) => {
    const footerData = new Footer(req.body);
    try {
      const newFooter = await footerData.save();
      return res.status(201).json(newFooter);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  
 exports.updatefooter = async (req, res) => {
    try {
      const updatedFooter = await Footer.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(updatedFooter);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  
  exports.deletefooter = async (req, res) => {
    try {
      await Footer.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Footer deleted' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  