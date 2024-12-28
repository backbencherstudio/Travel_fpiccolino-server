const { getImageUrl } = require("../../util/image_path");
const Country = require("../country/country.model");
const Header = require("../header/header.modls");
const SectinTitle = require("../sectionTitle/sectionTitle.models");
const Package = require("../package/package.model");
const getHomePage = async (req, res) => {
  try {
    // show counries with packages
    // const packagesGroupBycountries = await Country.find({});

    // packagesGroupBycountries.map((country) => {
    //   country.packages = country.packages.map((packageItem) => ({
    //     ...packageItem.toObject(),
    //     imageUrl: packageItem?.images?.map(
    //       (path) => `${process.env.APP_URL}${path}`
    //     ),
    //   }));
    // });

    // const response = {
      // hero: {
      //   title: "title",
      //   subtitle: "subtitle",
      // },
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
    // res.status(200).json(packagesGroupBycountries);

    const getHomeHeader = await Header.findOne({ pageName: "home" });
    const getsectionTitle = await SectinTitle.find({ name: { $regex: /^landing/ } });
    const getMostLovedAdventures = await Package.find();
    const getCountry = await Country.find();

    const transformedAdventures = getMostLovedAdventures
    .map(adventure => ({
      ...adventure.toObject(),  
      images: adventure.images.map(image => getImageUrl(image)), 
    }))
    // .sort(() => Math.random() - 0.5); 
  
    const transformedCountry = getCountry.map(country => ({
      ...country.toObject(),
      image: country.image ? getImageUrl(country.image) : null,  
    }));
    

    const response ={
      hero: {
        blogDetailsTitle: getHomeHeader?.blogDetailsTitle,
        image: getImageUrl(getHomeHeader?.image),
        titleOne: getHomeHeader?.titleOne,
        titleTwo: getHomeHeader?.titleTwo,
        pageName: getHomeHeader?.pageName,
        descriptionOne: getHomeHeader?.descriptionOne,
        descriptionTwo: getHomeHeader?.descriptionTwo,
      },
      sectionTitle:[
        ...getsectionTitle
      ],
      MostLovedAdventures: transformedAdventures,
      countries: transformedCountry
      

    }

    res.status(200).json(response);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    throw error.message;
  }
};

module.exports = {
  getHomePage,
};
