const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");

const cookieParser = require("cookie-parser");

const user = require("./modules/users/users.routes");

const blogss = require("./modules/blogs/blog.route");
const subscriber = require("./modules/subscriber/subscriber.routes");
const newsletter = require("./modules/newsletter/newsletter.routes");
const package = require("./modules/package/package.routes");

const category = require("./modules/category/category.routes");
const contact = require("./modules/contact/contact.route");

const package = require("./modules/package/package.routes")
const blogss = require("./modules/blogs/blog.route")

const blog = require("./modules/blog/blogs.routes");
const package = require("./modules/package/package.routes");
const category = require("./modules/category/category.routes");

const path = require("path");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://10.0.2.2:8081",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
app.use("/api/contact", contact);
app.use("/api/subscriber", subscriber);
//app.use("/api/newsletter", newsletter);

app.use("/api/blogs", blogss);

app.use("/blogs", blog);
app.use("/category", category);

app.use((req, res, next) => {
  res.status(400).json({
    message: "404! Route is not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err,
  });
});

module.exports = app;
