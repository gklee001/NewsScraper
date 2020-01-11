const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan")

//scraping tools
//axios is promised-based http library
const axios = require("axios");
const cheerio = require("cheerio");

//require all models
const db = require("./models");
const PORT = 3000;

//initalize express
const app = express();

//configure middleware
//use morgan logger to log requests
app.use(logger("dev"));
//parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//make public a static folder