const { getImageUrl, baseUrl } = require("../../util/image_path");
const Country = require("../country/country.model");
const Header = require("../header/header.modls");
const SectinTitle = require("../sectionTitle/sectionTitle.models");
const Package = require("../package/package.model");
const Review = require("../review/review.model");
const Blogs = require("../blogs/blog.model");
const Footer = require("../footer/footer.model");

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
      Blogs.find().select("_id category heroSection").lean(),
      Footer.find().lean(),
    ]);

    const transformedAdventures = getMostLovedAdventures.map((adventure) => ({
      ...adventure,
      images: adventure?.images?.map((image) => getImageUrl(image)),
      hotelImages: adventure?.images?.map((image) => getImageUrl(image)),
    }));
    //.sort((a, b) => b - a);

    const transformedCountry = getCountry.map((country) => ({
      ...country,
      image: country?.image ? getImageUrl(country.image) : null,
    }));
    // .sort((a, b) => b - a);

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
    })).sort((a, b) => b - a);

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
        data: transformedCountry,
      },
      titleWithoutContent: getSectionData("landing4"),
      review: {
        ...getSectionData("landing5"),
        data: getReview,
      },
      // contact: getSectionData("landing6"),
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
    const getTourHeader = await Header.findOne({ pageName: "tour" }); //for all inclucive

    const getsectionTitle = await SectinTitle.find({
      name: { $regex: /^all_inclusive_tour/ },
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

    res.status(200).json({ getTourHeader, getsectionTitle });
  } catch (error) {
    throw error.message;
  }
};

const country_wise = async (req, res) => {
  try {
    const country = await Country.findOne({ _id: req.params.id });

    const packages = country ? await Package.find({ country: country.name }) : [];

    const sectionTitle = await SectinTitle.find({
      name: { $regex: /^country_wise/ },
    });

    const footer = await Footer.find();
    const response = {
      hero: {
        image: getImageUrl(country?.image),
        titleOne: country?.contentTitle,
        descriptionOne: country?.contentDescription,
        countryName: country?.name,
      },
      package: {
        title: sectionTitle[0]?.title,
        subtitle: sectionTitle[0]?.description,
        data: packages,
      },
      footer: footer
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: error.message  });
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
  get_all_inclusive_TourPage,
  BlogPage,
  getPolicy,
  getAboutPage,
  country_wise,
};
