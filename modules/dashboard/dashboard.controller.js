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
    
   
    const totalOrders = await Order.countDocuments();

    if (totalOrders === 0) {
      console.log("No orders found.");
      return;
    }

    const completedOrders = await Order.countDocuments({ status: "completed" });

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
    let incrementStep = 10; // Define the increment step
    let currentIncrement = incrementStep; // Start with the first increment
    
    orders.forEach((order) => {
      const { destination, status } = order._id;
      const count = order.count;
    
      if (!destinationMap.has(destination)) {
        destinationMap.set(destination, { completed: 0, pending: 0 });
        radarData.destination.push(destination);
      }
    
      // Apply the count increment logic
      if (status === "completed") {
        destinationMap.get(destination).completed += currentIncrement;
        currentIncrement += incrementStep; // Increment for the next iteration
      } else if (status === "pending") {
        destinationMap.get(destination).pending += currentIncrement;
        currentIncrement += incrementStep; // Increment for the next iteration
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




const getOrderAndRevenueData = async (req, res) => {
  try {
    // Query for total orders by month
    const monthlyOrders = await Order.aggregate([
      {
        $project: {
          month: { $month: "$orderDate" },
        },
      },
      {
        $group: {
          _id: "$month",
          totalOrders: { $sum: 1 },  // Count the number of orders in each month
        },
      },
      {
        $sort: { "_id": 1 },
      },
      {
        $project: {
          x: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id", 1] }
            ]
          },
          y: "$totalOrders",
          _id: 0,
        },
      },
    ]);

    // Query for total orders by week
    const weeklyOrders = await Order.aggregate([
      {
        $project: {
          week: { $isoWeek: "$orderDate" },
        },
      },
      {
        $group: {
          _id: "$week",
          totalOrders: { $sum: 1 },  // Count the number of orders in each week
        },
      },
      {
        $sort: { "_id": 1 },
      },
      {
        $project: {
          x: { $concat: ["Week ", { $toString: "$_id" }] },
          y: "$totalOrders",
          _id: 0,
        },
      },
    ]);

    // Query for total orders by year
    const yearlyOrders = await Order.aggregate([
      {
        $project: {
          year: { $year: "$orderDate" },
        },
      },
      {
        $group: {
          _id: "$year",
          totalOrders: { $sum: 1 },  // Count the number of orders in each year
        },
      },
      {
        $sort: { "_id": 1 },
      },
      {
        $project: {
          x: { $toString: "$_id" },
          y: "$totalOrders",
          _id: 0,
        },
      },
    ]);

    // Query for monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $project: {
          month: { $month: "$orderDate" },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
      {
        $project: {
          x: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id", 1] }
            ]
          },
          y: "$totalRevenue",
          _id: 0,
        },
      },
    ]);

    // Query for weekly revenue
    const weeklyRevenue = await Order.aggregate([
      {
        $project: {
          week: { $isoWeek: "$orderDate" },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: "$week",
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
      {
        $project: {
          x: { $concat: ["Week ", { $toString: "$_id" }] },
          y: "$totalRevenue",
          _id: 0,
        },
      },
    ]);

    // Query for yearly revenue
    const yearlyRevenue = await Order.aggregate([
      {
        $project: {
          year: { $year: "$orderDate" },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: "$year",
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
      {
        $project: {
          x: { $toString: "$_id" },
          y: "$totalRevenue",
          _id: 0,
        },
      },
    ]);

    // Combine all the data into a single response
    const combinedData = {
      orderData: [
        ...monthlyOrders,
        ...weeklyOrders,
        ...yearlyOrders,
      ],
      revenueData: [
        ...monthlyRevenue,
        ...weeklyRevenue,
        ...yearlyRevenue,
      ],
    };

    res.json(combinedData);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching order and revenue data");
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
  getOrderAndRevenueData,
  bookingData
};
