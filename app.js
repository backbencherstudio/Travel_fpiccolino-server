const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");

const cookieParser = require("cookie-parser");
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

const orderPersonalDetails = require("./modules/order/orderPersonalDetails/orderPersonalDetails.routes");

const blogs = require("./modules/blogs/blog.route");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://10.0.2.2:8081",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
// app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: "changeit",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);

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
// app.use("/api/newsletter", newsletter);

app.use("/category", category);

app.use((req, res, next) => {
  res.status.json({
    message: "404! Route is not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err,
  });
});

module.exports = app;
