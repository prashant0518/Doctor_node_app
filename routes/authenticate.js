var express = require("express");
var router = express.Router();
const authController = require("../controllers/authenticate");
const isAuthAdmin = require("../middleware/is-adminAuthApi");


router.post("/register", authController.signUp);
router.post("/login", authController.login); 

module.exports = router