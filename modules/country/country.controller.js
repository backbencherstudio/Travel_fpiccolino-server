const { getImageUrl } = require("../../util/image_path");
const Country = require("./country.model");

const create = async (req, res) => {
  try {
    const { name, contentTitle, contentDescription } = req.body;

    // Initialize country object
    const countryData = {
      name,
      contentTitle,
      contentDescription,
    };

    if (req.file) {
      countryData.image = `/uploads/${req.file.filename}`;
    } else {
      countryData.image = null;
    }

    const country = new Country(countryData);

    await country.save();

    res.status(201).json({
      message: "Country created successfully",
      country: {
        ...country.toObject(),
        image: getImageUrl(country.image),  
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating country", error: error.message });
  }
};


const getAll = async (req, res) => {
  try {
    const countries = await Country.find().lean();
    const countriesWithImages = countries.map(country => ({
      ...country,
      image: country.image ? getImageUrl(country.image) : null,
    }));

    res.status(200).json(countriesWithImages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries", error: error.message });
  }
};


const getOne = async (req, res) => {
  try {
    const id = req.params.id;

    const country = await Country.findById(id).lean();

    if (country) {
      country.image = country.image ? getImageUrl(country.image) : null; 
      res.status(200).json(country);
    } else {
      res.status(404).json({ message: "Country not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching country", error: error.message });
  }
};

// const update = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { name, contentTitle, contentDescription } = req.body;

//     const country = await Country.findByIdAndUpdate(
//       id,
//       {
//         name: name,
//         contentTitle: contentTitle,
//         contentDescription: contentDescription,
//       },
//       {
//         new: true,
//       }
//     );
//     if (!country) {
//       return res.status(404).json({ message: "Country not found" });
//     }
//     res.status(200).json({
//       message: "Country updated successfully",
//     });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error updating country", error: error.message });
//   }
// };


// const update = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { name, contentTitle, contentDescription } = req.body;

//     const updateData = {
//       name,
//       contentTitle,
//       contentDescription,
//     };

//     if (req.file) {
//       updateData.image = `/uploads/${req.file.filename}`;
//     }

//     const country = await Country.findByIdAndUpdate(id, updateData, {
//       new: true, 
//     });

//     if (!country) {
//       return res.status(404).json({ message: "Country not found" });
//     }

//     res.status(200).json({
//       message: "Country updated successfully",
//       country: {
//         ...country.toObject(),
//         image: getImageUrl(country.image), 
//       },
//     });
//   } catch (error) {
//     res.status(400).json({ message: "Error updating country", error: error.message });
//   }
// };


const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, contentTitle, contentDescription } = req.body;

    const updateData = {
      name,
      contentTitle,
      contentDescription,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const country = await Country.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).json({
      message: "Country updated successfully",
      country: {
        ...country.toObject(),
        image: getImageUrl(country.image),  
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating country", error: error.message });
  }
};


const deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    const country = await Country.findByIdAndDelete(id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting countries", error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteData,
};
