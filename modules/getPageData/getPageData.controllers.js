const Country = require("../country/country.model");

const getHomePage = async (req, res) => {
  try {
    // show counries with packages
    const packagesGroupBycountries = await Country.find({}).populate("packages");

    // const response = {
    //   hero: {
    //     title: "title",
    //     subtitle: "subtitle",
    //   },
    //   package: {
    //     title: "title",
    //     subtitle: "subtitle",
    //     data: packagesGroupBycountries,
    //   },
    //   country: {
    //     title: "title",
    //     subtitle: "subtitle",
    //     data: [],
    //   },
    //   tour: {
    //     title: "title",
    //     subtitle: "subtitle",
    //     data: [],
    //   },
    //   review: {
    //     title: "title",
    //     subtitle: "subtitle",
    //     data: [],
    //   },
    //   contact: {
    //     title: "title",
    //     subtitle: "subtitle",
    //   },
    // };

    // res.status(200).json(response);
    res.status(200).json(packagesGroupBycountries);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    throw error.message;
  }
};

module.exports = {
  getHomePage,
};
