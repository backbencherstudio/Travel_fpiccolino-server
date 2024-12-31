const { getImageUrl } = require("../../util/image_path");
const Country = require("../country/country.model");
const Header = require("../header/header.modls");
const SectinTitle = require("../sectionTitle/sectionTitle.models");
const Package = require("../package/package.model");
const Review = require("../review/review.model");
const Blogs = require("../blogs/blog.model");
const Footer = require("../footer/footer.model");

// const getHomePage = async (req, res) => {
//   try {
//     const getHomeHeader = await Header.findOne({ pageName: "home" });
//     const getsectionTitle = await SectinTitle.find({
//       name: { $regex: /^landing/ },
//     });
//     const getMostLovedAdventures = await Package.find();
//     const getCountry = await Country.find();

//     const transformedAdventures = getMostLovedAdventures
//       .map((adventure) => ({
//         ...adventure.toObject(),
//         images: adventure?.images?.map((image) => getImageUrl(image)),
//       }))
//       .sort((a, b) => b - a);
//     // .sort(() => Math.random() - 0.5);
//     const transformedCountry = getCountry
//       .map((country) => ({
//         ...country.toObject(),
//         image: country?.image ? getImageUrl(country.image) : null,
//       }))
//       .sort((a, b) => b - a);
//     const getReview = await Review.find();
//     const Blog = await Blogs.find();
//     const footer = await Footer.find();

//     const response = {
//       hero: {
//         blogDetailsTitle: getHomeHeader?.blogDetailsTitle,
//         image: getImageUrl(getHomeHeader?.image),
//         titleOne: getHomeHeader?.titleOne,
//         titleTwo: getHomeHeader?.titleTwo,
//         pageName: getHomeHeader?.pageName,
//         descriptionOne: getHomeHeader?.descriptionOne,
//         descriptionTwo: getHomeHeader?.descriptionTwo,
//       },
//       package: {
//         title: getsectionTitle[0]?.title,
//         subtitle: getsectionTitle[0]?.description,
//         data: transformedAdventures,
//       },
//       country: {
//         title: getsectionTitle[1]?.title,
//         subtitle: getsectionTitle[1]?.description,
//         data: transformedCountry,
//       },
//       countryWithImage: {
//         title: getsectionTitle[2]?.title,
//         subtitle: getsectionTitle[2]?.description,
//         data: transformedCountry,
//       },
//       titleWithoutContent: {
//         title: getsectionTitle[3]?.title,
//         subtitle: getsectionTitle[3]?.description,
//       },
//       review: {
//         title: getsectionTitle[3]?.title,
//         subtitle: getsectionTitle[3]?.description,
//         data: getReview,
//       },
//       contact: {
//         title: getsectionTitle[4]?.title,
//         subtitle: getsectionTitle[4]?.description,
//         // data: getReview,
//       },
//       blogSection: {
//         title: getsectionTitle[5]?.title,
//         subtitle: getsectionTitle[5]?.description,
//         data: Blog,
//       },
//       footer: {
//         title: getsectionTitle[6]?.title,
//         subtitle: getsectionTitle[6]?.description,
//         footer: footer,
//       },

//       // sectionTitle:[
//       //   ...getsectionTitle
//       // ],
//       // MostLovedAdventures: transformedAdventures,
//       // countries: transformedCountry
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const getHomePage = async (req, res) => {
  try {
    const [
      getHomeHeader,
      getsectionTitle,
      getMostLovedAdventures,
      getCountry,
      getReview,
      Blog,
      footer,
    ] = await Promise.all([
      Header.findOne({ pageName: "home" }).lean(),
      SectinTitle.find({ name: { $regex: /^landing/ } }).lean(),
      Package.find().lean(),
      Country.find().select("name image").lean(),
      Review.find().lean(),
      Blogs.find().select("title content").lean(),
      Footer.find().lean(),
    ]);

    const transformedAdventures = getMostLovedAdventures
      .map((adventure) => ({
        ...adventure,
        images: adventure?.images?.map((image) => getImageUrl(image)),
        hotelImages: adventure?.images?.map((image) => getImageUrl(image)),

      }))
      .sort((a, b) => b - a);

    const transformedCountry = getCountry
      .map((country) => ({
        ...country,
        image: country?.image ? getImageUrl(country.image) : null,
      }))
      .sort((a, b) => b - a);

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
      },
      blogSection: {
        title: getsectionTitle[5]?.title,
        subtitle: getsectionTitle[5]?.description,
        data: Blog,
      },
      footer: {
        title: getsectionTitle[6]?.title,
        subtitle: getsectionTitle[6]?.description,
        footer: footer,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// const getHomePage = async (req, res) => {
//   try {
//     const cacheKey = "homePageData";
//     const cachedData = await redisClient.get(cacheKey);
//     if (cachedData) {
//       return res.status(200).json(JSON.parse(cachedData));
//     }

//     const [
//       getHomeHeader,
//       getsectionTitle,
//       getMostLovedAdventures,
//       getCountry,
//       getReview,
//       Blog,
//       footer,
//     ] = await Promise.all([
//       Header.findOne({ pageName: "home" }).select("image titleOne titleTwo descriptionOne descriptionTwo").lean(),
//       SectinTitle.find({ name: { $regex: /^landing/ } }).select("title description").lean(),
//       Package.find({ loved: true }).select("name images hotelImages").lean(),
//       Country.find().select("name image").lean(),
//       Review.find().limit(10).lean(),
//       Blogs.find().select("title content").lean(),
//       Footer.find().lean(),
//     ]);

//     const transformedAdventures = getMostLovedAdventures.map((adventure) => ({
//       ...adventure,
//       images: adventure.images?.map(getImageUrl),
//       hotelImages: adventure.hotelImages?.map(getImageUrl),
//     }));

//     const transformedCountry = getCountry.map((country) => ({
//       ...country,
//       image: country.image ? getImageUrl(country.image) : null,
//     }));

//     const response = {
//       hero: {
//         titleOne: getHomeHeader?.titleOne,
//         titleTwo: getHomeHeader?.titleTwo,
//         image: getImageUrl(getHomeHeader?.image),
//         descriptionOne: getHomeHeader?.descriptionOne,
//         descriptionTwo: getHomeHeader?.descriptionTwo,
//       },
//       package: {
//         title: getsectionTitle[0]?.title,
//         subtitle: getsectionTitle[0]?.description,
//         data: transformedAdventures,
//       },
//       country: {
//         title: getsectionTitle[1]?.title,
//         subtitle: getsectionTitle[1]?.description,
//         data: transformedCountry,
//       },
//       review: {
//         title: getsectionTitle[3]?.title,
//         subtitle: getsectionTitle[3]?.description,
//         data: getReview,
//       },
//       blogSection: {
//         title: getsectionTitle[5]?.title,
//         subtitle: getsectionTitle[5]?.description,
//         data: Blog,
//       },
//       footer: {
//         data: footer,
//       },
//     };

//     // Cache the response
//     redisClient.set(cacheKey, JSON.stringify(response), "EX", 3600); // Cache for 1 hour
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



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
