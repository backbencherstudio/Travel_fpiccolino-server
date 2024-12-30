const orderModels = require("../order/order.models");
const Order = require("../order/order.models");
const Package = require("../package/package.model");

const getAll = async (req, res) => {
  try {
   
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const orderss = await Order.find().populate("packageId");

    // Initialize passenger sum
    let totalPassengers = 0;

    // Iterate through orders and sum passengers
    orderss.forEach((order) => {
      if (order.packageId && order.packageId.pessenger) {
        totalPassengers += order.packageId.pessenger;
      }
    });
    let completedOrders = 0;
    let pendingOrders = 0;
    orderss.map((order) => {
      if (order.status === "completed") {
        completedOrders += 1;
      }
      else if(order.status === "pending") {
        pendingOrders += 1;
      }
    });

   
    
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
    //const orders = await orderModels.find().sort({ orderDate: -1 }).limit(8);

    res.status(200).json({
      totalRevenue: totalRevenue,
      totalTravellers: totalPassengers,
      totalProfit: totalProfit,
      totalOrders: totalOrders,
      totalOrdersByCountry: totalOrdersByCountry,
      completedOrders,
      pendingOrders
     
      // orders: orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching countries", error: error.message });
  }
};


const getRadarData = async (req, res) => {
  try {
    // Aggregate data from orders and join with package data
   
    const totalOrders = await Order.countDocuments();

    // If there are no orders, return 0% for both
    if (totalOrders === 0) {
      console.log("No orders found.");
      return;
    }

    // Get the count of 'completed' orders
    const completedOrders = await Order.countDocuments({ status: "completed" });

    // Get the count of 'pending' orders
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    // Calculate percentages
    const completedPercentage = ((completedOrders / totalOrders) * 100).toFixed(2);
    const pendingPercentage = ((pendingOrders / totalOrders) * 100).toFixed(2);



















    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: "$package" },
      {
        $group: {
          _id: {
            destination: "$package.destination",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Process aggregated data to radar chart format
    const radarData = {
      destination: [],
      completed: [],
      pending: [],
    };

    const destinationMap = new Map();

    orders.forEach((order) => {
      const { destination, status } = order._id;
      const count = order.count;

      if (!destinationMap.has(destination)) {
        destinationMap.set(destination, { completed: 0, pending: 0 });
        radarData.destination.push(destination);
      }

      if (status === "completed") {
        destinationMap.get(destination).completed += count;
      } else if (status === "pending") {
        destinationMap.get(destination).pending += count;
      }
    });

    // Populate radarData
    radarData.completed = radarData.destination.map(
      (destination) => destinationMap.get(destination).completed || 0
    );
    radarData.pending = radarData.destination.map(
      (destination) => destinationMap.get(destination).pending || 0
    );

    // Send response
    res.status(200).json({radarData,completedPercentage,pendingPercentage});
  } catch (error) {
    console.error("Error fetching radar data:", error);
    res.status(500).json({ error: "Failed to fetch radar data" });
  }
};




// Controller function for getting total revenue by month and week
const getRevenueData = async (req, res) => {
  try {
    // Query for monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $project: {
          month: { $month: "$orderDate" },
          year: { $year: "$orderDate" },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          x: {
            $concat: [
              { 
                $arrayElemAt: [
                  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  { $subtract: ["$_id.month", 1] }
                ] 
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          y: "$totalRevenue",
          _id: 0,  // Remove the _id field from the response
        },
      },
    ]);

    // Query for weekly revenue
    const weeklyRevenue = await Order.aggregate([
      {
        $project: {
          week: { $isoWeek: "$orderDate" },
          year: { $year: "$orderDate" },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: { week: "$week", year: "$year" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
      {
        $project: {
          x: { $concat: ["Week ", { $toString: "$_id.week" }] },
          y: "$totalRevenue",
          _id: 0,  // Remove the _id field from the response
        },
      },
    ]);

    // Return both monthly and weekly revenue data
    return res.status(200).json({
      success: true,
      revenueData: {
        monthly: monthlyRevenue,
        weekly: weeklyRevenue,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};   



const bookingData = async (req, res) => {
  const orders = await Order.find().populate("packageId").populate("userId");
  let data = []
  orders.map((order) => {
    const userInfo = order.userId;
    
   const onedata = {
      bookingId: order._id,
      customerName: userInfo?.name,
      customerImg:   userInfo?.image,
      destination: order.packageId.destination,
      amount: order.totalPrice,
      status: order?.status,
      date: order.orderDate
    }
    data.push(onedata);
  });
  return res.status(200).json({ success: true, data });
}


module.exports = {
  getAll,
  getRadarData,
  getRevenueData,
  bookingData
};
