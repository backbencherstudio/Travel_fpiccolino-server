const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
const user = require("./modules/users/users.routes");

const subscriber = require("./modules/subscriber/subscriber.routes");
const newsletter = require("./modules/newsletter/newsletter.routes");
const package = require("./modules/package/package.routes");
const category = require("./modules/category/category.routes");
const blogss = require("./modules/blogs/blog.route");
const contact = require("./modules/contact/contact.route");
const payment = require("./modules/payment/payment.routes");
const transaction = require("./modules/transaction/transaction.routes");
const country = require("./modules/country/country.routes");
const pageData = require("./modules/getPageData/getPageData.routes");
const header = require("./modules/header/header.routes");
const order = require("./modules/order/order.routes");
const sectionTitle = require("./modules/sectionTitle/sectionTitle.routes");
const review = require("./modules/review/review.route");
const footer = require("./modules/footer/footer.route");
const dashboard = require("./modules/dashboard/dashboard.routes");
const approach = require("./modules/approach/approach.routes");
const faq = require("./modules/faq/faq.routes");
const textsRoutes = require("./modules/texts/texts.routes");
const orderPersonalDetails = require("./modules/order/orderPersonalDetails/orderPersonalDetails.routes");
const whyUs = require("./modules/whyUs/whyUs.routes");
const blogs = require("./modules/blogs/blog.route");
const policy = require("./modules/policy/policy.routes");
const authBanners = require("./modules/authBanners/authBanners.routes");

const shorts = require("./modules/shorts/short.route");
const app = express();


// CORS configuration
app.use(
  cors({
    origin: [
      "http://46.202.164.243",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://latuafugalowcost.it",
      "https://www.latuafugalowcost.it"
    ],
    credentials: true,
  })
);

// Other middleware
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: "changeit",                
    resave: false,                     
    saveUninitialized: true,           
    cookie: { maxAge: 2 * 60 * 1000 },
  })
);



app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom body parser middleware
app.use((req, res, next) => {
  if (req.originalUrl === "/order/webhook") {
    bodyParser.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/users", user);
app.use("/package", package);
app.use("/category", category);
app.use("/api/blogs", blogss);

app.use("/category", category);
app.use("/api/blogs", blogs);
app.use("/api/contact", contact);
app.use("/api/subscriber", subscriber);
app.use("/api/newsletter", newsletter);
app.use("/api/payment", payment);
app.use("/api/transaction", transaction);
app.use("/api/country", country);
app.use("/api/pageData", pageData);
app.use("/header", header);
app.use("/order", order);
app.use("/section-title", sectionTitle);

app.use("/api/review", review);
app.use("/api/footer", footer);

app.use("/order/:orderId/orderPersonalDetails", orderPersonalDetails);
app.use("/dashboard", dashboard);
app.use("/api/shorts", shorts);
app.use("/api/newsletter", newsletter);

app.use("/category", category);
app.use("/api/approach", approach);
app.use("/api/faq", faq);
app.use("/api/texts", textsRoutes);
app.use("/api/whyUs", whyUs);
app.use("/api/policy", policy);
app.use("/api/auth-banners", authBanners);













app.use((req, res, next) => {
  res.status.json({
    message: "404! Route is not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "500! internal server error!", err });
});

module.exports = app;

// const session = require("express-session");
// const RedisStore = require("connect-redis")(session);

// app.use(
//   session({
//     store: new RedisStore({ url: process.env.REDIS_URL }),
//     secret: process.env.SESSION_SECRET || "changeit",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 3600000, // 1 hour
//       secure: process.env.NODE_ENV === "production", // true in production
//       sameSite: "strict",
//     },
//   })
// );

// app.enable("trust proxy"); // or app.set("trust proxy", 1);

// cookie: {
//   maxAge: 3600000,
//   secure: process.env.NODE_ENV === "production", // true only in production
//   sameSite: "strict",
// },

// const express = require("express");
// const session = require("express-session");
// const RedisStore = require("connect-redis")(session);
// const app = express();

// // If behind a proxy like NGINX/Heroku
// app.set("trust proxy", 1);

// app.use(
//   session({
//     store: new RedisStore({ url: process.env.REDIS_URL }),
//     secret: process.env.SESSION_SECRET || "somefallbacksecret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 3600000, // 1 hour
//       secure: process.env.NODE_ENV === "production", // cookies only over HTTPS in production
//       sameSite: "strict",
//     },
//   })
// );

// app.get("/", (req, res) => {
//   req.session.views = (req.session.views || 0) + 1;
//   res.send(`You have viewed this page ${req.session.views} times`);
// });

// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });
