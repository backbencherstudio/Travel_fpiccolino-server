const getImageUrl = (imagePath) => {
  return `${process.env.APP_URL}${imagePath}`;
};
module.exports = {
  getImageUrl,
};
