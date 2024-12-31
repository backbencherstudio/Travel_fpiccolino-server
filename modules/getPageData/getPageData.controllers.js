const { getImageUrl } = require("../../util/image_path");
const Country = require("../country/country.model");
const Header = require("../header/header.modls");
const SectinTitle = require("../sectionTitle/sectionTitle.models");
const Package = require("../package/package.model");
const Review = require("../review/review.model");
const Blogs = require("../blogs/blog.model");

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
    // package: {
    //   title: "title",
    //   subtitle: "subtitle",
    //   data: packagesGroupBycountries,
    // },
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
    const getsectionTitle = await SectinTitle.find({
      name: { $regex: /^landing/ },
    });
    const getMostLovedAdventures = await Package.find();
    const getCountry = await Country.find();

    const transformedAdventures = getMostLovedAdventures
      .map((adventure) => ({
        ...adventure.toObject(),
        images: adventure?.images?.map((image) => getImageUrl(image)),
      }))
      .sort((a, b) => b - a);
    // .sort(() => Math.random() - 0.5);

    const transformedCountry = getCountry
      .map((country) => ({
        ...country.toObject(),
        image: country?.image ? getImageUrl(country.image) : null,
      }))
      .sort((a, b) => b - a);

    const getReview = await Review.find();
    const Blog = await Blogs.find(); //.sort(() => Math.random() - 0.5);

    const response = {
      hero: {
        blogDetailsTitle: getHomeHeader?.blogDetailsTitle,
        image: getImageUrl(getHomeHeader?.image),
        titleOne: getHomeHeader?.titleOne,
        titleTwo: getHomeHeader?.titleTwo,
        pageName: getHomeHeader?.pageName,
        descriptionOne: getHomeHeader?.descriptionOne,
        descriptionTwo: getHomeHeader?.descriptionTwo,
      },
      package: {
        title: getsectionTitle[0]?.title,
        subtitle: getsectionTitle[0]?.description,
        data: transformedAdventures,
      },
      country: {
        title: getsectionTitle[1]?.title,
        subtitle: getsectionTitle[1]?.description,
        data: transformedCountry,
      },
      countryWithImage: {
        title: getsectionTitle[2]?.title,
        subtitle: getsectionTitle[2]?.description,
        data: transformedCountry,
      },
      titleWithoutContent: {
        title: getsectionTitle[3]?.title,
        subtitle: getsectionTitle[3]?.description,
      },
      review: {
        title: getsectionTitle[3]?.title,
        subtitle: getsectionTitle[3]?.description,
        data: getReview,
      },
      contact: {
        title: getsectionTitle[4]?.title,
        subtitle: getsectionTitle[4]?.description,
        // data: getReview,
      },
      blogSection: {
        title: getsectionTitle[5]?.title,
        subtitle: getsectionTitle[5]?.description,
        data: Blog,
      },

      // sectionTitle:[
      //   ...getsectionTitle
      // ],
      // MostLovedAdventures: transformedAdventures,
      // countries: transformedCountry
    };

    res.status(200).json(response);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    throw error.message;
  }
};

const getTourPage = async (req, res) => {
  try {
    const getTourHeader = await Header.findOne({ pageName: "tour" });

    const getsectionTitle = await SectinTitle.find({
      name: { $regex: /^tour/ },
    });

    const packages = await Package.aggregate([
      {
        $facet: {
          allInclusive: [
            { $match: { category: "all inclusive" } },
            { $limit: 10 },
          ],
          others: [
            { $match: { category: { $ne: "all inclusive" } } },
            { $limit: 10 },
          ],
        },
      },
    ]);
    // const getCountry = await Country.find();

    // const transformedTour = getTourPackage
    //   .map((adventure) => ({
    //     ...adventure.toObject(),
    //     images: adventure?.images?.map((image) => getImageUrl(image)),
    //   }))
    //   .sort((a, b) => b - a);

    const response = {
      hero: {
        blogDetailsTitle: getTourHeader?.blogDetailsTitle,
        image: getImageUrl(getTourHeader?.image),
        titleOne: getTourHeader?.titleOne,
        titleTwo: getTourHeader?.titleTwo,
        pageName: getTourHeader?.pageName,
        descriptionOne: getTourHeader?.descriptionOne,
        descriptionTwo: getTourHeader?.descriptionTwo,
      },
      about: {
        title: getsectionTitle[0]?.title,
        subtitle: getsectionTitle[0]?.description,
      },
      team: {
        title: getsectionTitle[1]?.title,
        subtitle: getsectionTitle[1]?.description,
      },
      testimonial: {
        title: getsectionTitle[2]?.title,
        subtitle: getsectionTitle[2]?.description,
      },
      contact: {
        title: getsectionTitle[3]?.title,
        subtitle: getsectionTitle[3]?.description,
      },
    };

    res.status(200).json(packages);
  } catch (error) {
    throw error.message;
  }
};

const BlogPage = async (req, res) => {
  try {
    const getBlogs = await Blogs.find();
    res.status(200).json(getBlogs);

    const categories = [...new Set(getBlogs.map((blog) => blog.category))];

    const categoryLists = categories.map((category) => {
      return {
        category: category,
        blogs: getBlogs.filter((blog) => blog.category === category),
      };
    });

    const response = {
      hero: {
        blogDetailsTitle: getHomeHeader?.blogDetailsTitle,
        image: getImageUrl(getHomeHeader?.image),
        titleOne: getHomeHeader?.titleOne,
        titleTwo: getHomeHeader?.titleTwo,
        pageName: getHomeHeader?.pageName,
        descriptionOne: getHomeHeader?.descriptionOne,
        descriptionTwo: getHomeHeader?.descriptionTwo,
      },
      categoryLists,
    };

    res.status(200).json(response);
  } catch (error) {
    throw error.message;
  }
};

const getPolicy = async (req, res) => {
  try {
    const getHomeHeader = await Header.findOne({ pageName: "policy" });
    // const footer = await
    const getsectionTitle = await SectinTitle.find({
      name: { $regex: /^policy/ },
    });
    const response = {
      hero: {
        blogDetailsTitle: getHomeHeader?.blogDetailsTitle,
        image: getImageUrl(getHomeHeader?.image),
        titleOne: getHomeHeader?.titleOne,
        titleTwo: getHomeHeader?.titleTwo,
        pageName: getHomeHeader?.pageName,
        descriptionOne: getHomeHeader?.descriptionOne,
        descriptionTwo: getHomeHeader?.descriptionTwo,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};
// const
module.exports = {
  getHomePage,
  getTourPage,
  BlogPage,
  getPolicy,
};
