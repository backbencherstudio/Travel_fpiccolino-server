const getHomePage = async (req, res) => {
  try {
    const response = {
      hero: {
        title: "title",
        subtitle: "subtitle",
      },
      package: {
        title: "title",
        subtitle: "subtitle",
        data: [],
      },
      country: {
        title: "title",
        subtitle: "subtitle",
        data: [],
      },
      tour: {
        title: "title",
        subtitle: "subtitle",
        data: [],
      },
      review: {
        title: "title",
        subtitle: "subtitle",
        data: [],
      },
      contact: {
        title: "title",
        subtitle: "subtitle",
      },
    };
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getHomePage,
};
