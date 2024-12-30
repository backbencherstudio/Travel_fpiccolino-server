const orderModels = require("../order/order.models");

const getAll = async (req, res) => {
  try {
    // get total revenue using order totalPrice field
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // get total travellers using order passenger field 
    const totalTravellers = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$passenger" } } },
    ]);

    // get total profit using order totalPrice field and cost_per_package field, profit is totalPrice - cost_per_package
    const totalCostPerPackage = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$cost_per_package" } } },
    ]);

    const totalProfit = totalRevenue - totalCostPerPackage;

    const totalOrders = await Order.countDocuments();

    // reuturn array of "country_name": "package count"
    const totalOrdersByCountry = await orderModels.aggregate([
      {
        $group: {
          _id: "$shippingAddress.country",
          total: { $sum: "$quantity" },
        },
      },
    ]);

    // show 8 most recent orders
    const orders = await orderModels.find().sort({ orderDate: -1 }).limit(8);

    res.status(200).json({
      totalRevenue: totalRevenue,
      totalTravellers: totalTravellers,
      totalProfit: totalProfit,
      totalOrders: totalOrders,
      totalOrdersByCountry: totalOrdersByCountry,
      orders: orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching countries", error: error.message });
  }
};

module.exports = {
  getAll,
};
