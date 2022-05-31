var express = require("express");
var router = express.Router();
const patientController = require("../controllers/patient");
const isAuthAdmin = require("../middleware/is-adminAuthApi");


