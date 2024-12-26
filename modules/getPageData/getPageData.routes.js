const express = require("express");

const {getHomePage} = require("./getPageData.controllers")
const router = express.Router();

router.get("/", getHomePage);