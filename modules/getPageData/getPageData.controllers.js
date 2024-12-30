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

// const getAboutPage = async (req, res) => {
//   try {
//     const getAboutHeader = await Header.findOne({ pageName: "about" });
//     const getAboutSectionTitle = await SectinTitle.find({
//       name: { $regex: /^about/ },
//     });

//     const response = {
//       hero: {
//         blogDetailsTitle: getAboutHeader?.blogDetailsTitle,
//         image: getImageUrl(getAboutHeader?.image),
//         titleOne: getAboutHeader?.titleOne,
//         titleTwo: getAboutHeader?.titleTwo,
//         pageName: getAboutHeader?.pageName,
//         descriptionOne: getAboutHeader?.descriptionOne,
//         descriptionTwo: getAboutHeader?.descriptionTwo,
//       },
//       about: {
//         title: getAboutSectionTitle[0]?.title,
//         subtitle: getAboutSectionTitle[0]?.description,
//       },
//       team: {
//         title: getAboutSectionTitle[1]?.title,
//         subtitle: getAboutSectionTitle[1]?.description,
//       },
//       testimonial: {
//         title: getAboutSectionTitle[2]?.title,
//         subtitle: getAboutSectionTitle[2]?.description,
//       },
//       contact: {
//         title: getAboutSectionTitle[3]?.title,
//         subtitle: getAboutSectionTitle[3]?.description,
//         data: getReview
//       },
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     // res.status(500).json({ error: error.message });
//     throw error.message;
//   }
// };

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
      categoryLists
    }

    res.status(200).json(response);
  } catch (error) {
    throw error.message;
  }
};

module.exports = {
  getHomePage,
  BlogPage,
};
