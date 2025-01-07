const { getImageUrl, baseUrl } = require("../../util/image_path");
const Country = require("../country/country.model");
const Header = require("../header/header.modls");
const SectinTitle = require("../sectionTitle/sectionTitle.models");
const Package = require("../package/package.model");
const Review = require("../review/review.model");
const Blogs = require("../blogs/blog.model");
const Footer = require("../footer/footer.model");
const shortModel = require("../shorts/short.model");

// const getHomePage = async (req, res) => {
//   try {
//     const [
//       getHomeHeader,
//       getsectionTitle,
//       getMostLovedAdventures,
//       getCountry,
//       getReview,
//       Blog,
//       footer,
//     ] = await Promise.all([
//       Header.findOne({ pageName: "home" }).lean(),
//       SectinTitle.find({ name: { $regex: /^landing/ } }).lean(),
//       Package.find().lean(),
//       Country.find().lean(),
//       Review.find().lean(),
//       Blogs.find().select("_id category heroSection").lean(),
//       Footer.find().lean(),
//     ]);

//     const transformedAdventures = getMostLovedAdventures.map((adventure) => ({
//       ...adventure,
//       images: adventure?.images?.map((image) => getImageUrl(image)),
//       hotelImages: adventure?.images?.map((image) => getImageUrl(image)),
//     }));
//     //.sort((a, b) => b - a);

//     const transformedCountry = getCountry.map((country) => ({
//       ...country,
//       image: country?.image ? getImageUrl(country.image) : null,
//     }));
//     // .sort((a, b) => b - a);

//     const getSectionData = (name) => {
//       const section = getsectionTitle.find((item) => item.name === name);
//       return {
//         title: section?.title || "",
//         description: section?.description || "",
//       };
//     };

//     const blogSection = Blog.map((blog) => ({
//       ...blog,
//       headerImg: blog?.heroSection?.length
//         ? `${baseUrl}/uploads/${blog.heroSection[0].headerImg}`
//         : null,
//     })).sort((a, b) => b - a);

//     const response = {
//       hero: {
//         blogDetailsTitle: getHomeHeader?.blogDetailsTitle,
//         image: getImageUrl(getHomeHeader?.heroImage),
//         titleOne: getHomeHeader?.titleOne,
//         titleTwo: getHomeHeader?.titleTwo,
//         pageName: getHomeHeader?.pageName,
//         descriptionOne: getHomeHeader?.descriptionOne,
//         descriptionTwo: getHomeHeader?.descriptionTwo,
//       },
//       package: {
//         ...getSectionData("landing1"),
//         data: transformedAdventures,
//       },
//       country: {
//         ...getSectionData("landing2"),
//         data: transformedCountry,
//       },
//       countryWithImage: {
//         ...getSectionData("landing3"),
//         data: transformedCountry,
//       },
//       titleWithoutContent: getSectionData("landing4"),
//       review: {
//         ...getSectionData("landing5"),
//         data: getReview,
//       },
//       // contact: getSectionData("landing6"),
//       blogSection: {
//         ...getSectionData("landing6"),
//         data: blogSection,
//       },
//       footer: footer,
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
      Country.find().lean(),
      Review.find().lean(),
      Blogs.find().select("_id category heroSection").lean(),
      Footer.find().lean(),
    ]);

    const transformedAdventures = getMostLovedAdventures.map((adventure) => ({
      ...adventure,
      images: adventure?.images?.map((image) => getImageUrl(image)),
      hotelImages: adventure?.images?.map((image) => getImageUrl(image)),
    }));

    const transformedCountry = getCountry.map((country) => ({
      ...country,
      image: country?.image ? getImageUrl(country.image) : null,
    }));

    const getSectionData = (name) => {
      const section = getsectionTitle.find((item) => item.name === name);
      return {
        title: section?.title || "",
        description: section?.description || "",
      };
    };

    const blogSection = Blog.map((blog) => ({
      ...blog,
      headerImg: blog?.heroSection?.length
        ? `${baseUrl}/uploads/${blog.heroSection[0].headerImg}`
        : null,
    }));

    // Include lowest amount for each country
    const countryWithLowestAmount = transformedCountry.map((country) => {
      const countryPackages = transformedAdventures.filter(
        (adventure) => adventure.country === country.name
      );

      const lowestAmount = countryPackages.reduce(
        (prev, curr) => (prev.amount < curr.amount ? prev : curr),
        {}
      ).amount;

      return {
        ...country,
        lowestAmount: lowestAmount || null, // Include only the amount
      };
    });

    const response = {
      hero: {
        blogDetailsTitle: getHomeHeader?.blogDetailsTitle,
        image: getImageUrl(getHomeHeader?.heroImage),
        titleOne: getHomeHeader?.titleOne,
        titleTwo: getHomeHeader?.titleTwo,
        pageName: getHomeHeader?.pageName,
        descriptionOne: getHomeHeader?.descriptionOne,
        descriptionTwo: getHomeHeader?.descriptionTwo,
      },
      package: {
        ...getSectionData("landing1"),
        data: transformedAdventures,
      },
      country: {
        ...getSectionData("landing2"),
        data: transformedCountry,
      },
      countryWithImage: {
        ...getSectionData("landing3"),
        data: countryWithLowestAmount,
      },
      titleWithoutContent: getSectionData("landing4"),
      review: {
        ...getSectionData("landing5"),
        data: getReview,
      },
      blogSection: {
        ...getSectionData("landing6"),
        data: blogSection,
      },
      footer: footer,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAboutPage = async (req, res) => {
  try {
    const [getHomeHeader, getsectionTitle, footer] = await Promise.all([
      Header.findOne({ pageName: "about" }).lean(),
      SectinTitle.find({ name: { $regex: /^about/ } }).lean(),
      Footer.find().lean(),
    ]);

    const getSectionData = (name) => {
      const section = getsectionTitle.find((item) => item.name === name);
      return {
        title: section?.title || "",
        description: section?.description || "",
      };
    };

    const response = {
      hero: {
        blogDetailsTitle: getHomeHeader?.blogDetailsTitle,
        image: getImageUrl(getHomeHeader?.heroImage),
        titleOne: getHomeHeader?.titleOne,
        titleTwo: getHomeHeader?.titleTwo,
        pageName: getHomeHeader?.pageName,
        descriptionOne: getHomeHeader?.descriptionOne,
        descriptionTwo: getHomeHeader?.descriptionTwo,
      },
      aboutWithoutContent: {
        ...getSectionData("about1"),
      },
      footer_3: {
        ...getSectionData("about2"),
      },
      footer: footer,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

const get_all_inclusive_TourPage = async (req, res) => {
  try {
    const [getTourHeader, getsectionTitle, packages] = await Promise.all([
      Header.findOne({ pageName: "tour" }).lean(),
      SectinTitle.find({ name: { $regex: /^all_inclusive_tour/ } }).lean(),
      Package.aggregate([
        {
          $addFields: {
            bookedFlights: {
              $cond: {
                if: { $gt: [{ $size: "$bookedFlights" }, 0] },
                then: "$bookedFlights",
                else: "$$REMOVE",
              },
            },
          },
        },
      ]),
    ]);

    // Convert section titles array to a dictionary for faster lookups
    const sectionTitleMap = getsectionTitle.reduce((acc, item) => {
      acc[item.name] = item;
      return acc;
    }, {});

    const getSectionData = (name) => ({
      title: sectionTitleMap[name]?.title || "",
      description: sectionTitleMap[name]?.description || "",
    });

    const transformedPackages = packages.map((pkg) => ({
      ...pkg,
      images: pkg.images?.map(getImageUrl) || [],
      hotelImages: pkg.hotelImages?.map(getImageUrl) || [],
    }));

    const response = {
      hero: {
        blogDetailsTitle: getTourHeader?.blogDetailsTitle,
        heroImage: getImageUrl(getTourHeader?.heroImage),
        titleOne: getTourHeader?.titleOne,
        titleTwo: getTourHeader?.titleTwo,
        pageName: getTourHeader?.pageName,
        descriptionOne: getTourHeader?.descriptionOne,
        descriptionTwo: getTourHeader?.descriptionTwo,
      },
      package: {
        ...getSectionData("all_inclusive_tour1"),
        data: transformedPackages,
      },
      shortVideo: {
        ...getSectionData("all_inclusive_tour2"),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching all-inclusive tour page data:", error);
    res.status(500).json({ error: error.message });
  }
};

const country_wise = async (req, res) => {
  try {
    const countryId = req.params.id;
    const country = await Country.findOne({ _id: countryId }).lean();
    const [packages, sectionTitles, footer] = await Promise.all([
      Package.find({ country: country.name }).lean(),
      SectinTitle.find({ name: { $regex: /^country_wise/ } })
        .select("title description")
        .lean(),
      Footer.find().lean(),
    ]);

    const transformedPackages = packages.map((pkg) => ({
      ...pkg,
      images: pkg.images?.map(getImageUrl) || [],
      hotelImages: pkg.hotelImages?.map(getImageUrl) || [],
    }));

    const response = {
      hero: {
        heroImage: getImageUrl(country?.image),
        titleOne: country?.contentTitle || "",
        descriptionOne: country?.contentDescription || "",
        countryName: country?.name || "",
      },
      package: {
        title: sectionTitles?.[0]?.title,
        subtitle: sectionTitles?.[0]?.description,
        data: transformedPackages,
      },
      
      footer: footer.map((item) => ({
        companyName: item.companyName,
        description: item.description,
        contactInfo: item.contactInfo,
        quickLinks: item.quickLinks,
        copyright: item.copyright,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const BlogPage = async (req, res) => {
  try {
    const [getHomeHeader, getBlogs, footer] = await Promise.all([
      Header.findOne({ pageName: "blog" }).lean(),
      Blogs.find().lean(),
      Footer.find().lean(),
    ]);

    const categories = [...new Set(getBlogs.map((blog) => blog.category))];

    const categoryLists = categories.map((category) => ({
      category: category,
      blogs: getBlogs.filter((blog) => blog.category === category),
    }));

    const response = {
      hero: {
        // blogDetailsTitle: getHomeHeader?.blogDetailsTitle || "",
        image: getHomeHeader?.heroImage
          ? getImageUrl(getHomeHeader.heroImage)
          : null,
        titleOne: getHomeHeader?.titleOne || "",
        // titleTwo: getHomeHeader?.titleTwo || "",
        // pageName: getHomeHeader?.pageName || "",
        descriptionOne: getHomeHeader?.descriptionOne || "",
        // descriptionTwo: getHomeHeader?.descriptionTwo || "",
      },
      categoryLists,
      footer,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message }); // Improved error handling
  }
};

const getPolicy = async (req, res) => {
  try {
    // const [getPolicyHeader, footer] = await Promise.all([
    //   Header.findOne({ pageName: "policy" }).lean(),
    //   Footer.find().lean(),
    // ]);

    const getPolicyHeader = await Header.findOne({ pageName: "policy" }).lean();

    console.log(getPolicyHeader);
    const response = {
      hero: {
        blogDetailsTitle: getPolicyHeader?.blogDetailsTitle,
        image: getPolicyHeader?.heroImage
          ? getImageUrl(getPolicyHeader.heroImage)
          : null,
        titleOne: getPolicyHeader?.titleOne,
        titleTwo: getPolicyHeader?.titleTwo,
        pageName: getPolicyHeader?.pageName,
        descriptionOne: getPolicyHeader?.descriptionOne,
        descriptionTwo: getPolicyHeader?.descriptionTwo,
      },
      // footer: footer,
    };

    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

const getfaq = async (req, res) => {
  try {
    // const [getFaqHeader, footer] = await Promise.all([
    //   Header.findOne({ pageName: "faq" }).lean(),
    //   Footer.find().lean(),
    // ]);

    const getFaqHeader = await Header.findOne({ pageName: "faq" }).lean();

    const response = {
      hero: {
        blogDetailsTitle: getFaqHeader?.blogDetailsTitle,
        image: getFaqHeader?.heroImage
          ? getImageUrl(getFaqHeader.heroImage)
          : null,
        titleOne: getFaqHeader?.titleOne,
        titleTwo: getFaqHeader?.titleTwo,
        pageName: getFaqHeader?.pageName,
        descriptionOne: getFaqHeader?.descriptionOne,
        descriptionTwo: getFaqHeader?.descriptionTwo,
      },
      // footer,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

// const contactPage = async (req, res) => {
//   try {
//     const [getContactHeader, footer] = await Promise.all([
//       Header.findOne({ pageName: "contact" }).lean(),
//       Footer.find().lean(),
//     ]);

//     const response = {
//       hero: {
//         blogDetailsTitle: getContactHeader?.blogDetailsTitle,
//         image: getContactHeader?.heroImage
//           ? getImageUrl(getContactHeader.heroImage)
//           : null,
//         titleOne: getContactHeader?.titleOne,
//         titleTwo: getContactHeader?.titleTwo,
//         pageName: getContactHeader?.pageName,
//         descriptionOne: getContactHeader?.descriptionOne,
//         descriptionTwo: getContactHeader?.descriptionTwo,
//       },
//       footer,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred", error });
//   }
// };

const contactPage = async (req, res) => {
  try {
    const getContactHeader = await Header.findOne({
      pageName: "contact",
    }).lean();

    if (!getContactHeader) {
      return res.status(404).json({ message: "Contact header not found" });
    }

    const response = {
      hero: {
        blogDetailsTitle: getContactHeader.blogDetailsTitle,
        image: getContactHeader.heroImage
          ? getImageUrl(getContactHeader.heroImage)
          : null,
        titleOne: getContactHeader.titleOne,
        titleTwo: getContactHeader.titleTwo,
        pageName: getContactHeader.pageName,
        descriptionOne: getContactHeader.descriptionOne,
        descriptionTwo: getContactHeader.descriptionTwo,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching contact page data:", error);
    res.status(500).json(error.message);
  }
};

module.exports = {
  getHomePage,
  get_all_inclusive_TourPage,
  BlogPage,
  getPolicy,
  getAboutPage,
  country_wise,
  getfaq,
  contactPage,
};
