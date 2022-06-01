var express = require("express");
var router = express.Router();
const patientController = require("../controllers/patient");
// const isAuthAdmin = require("../middleware/is-adminAuthApi");


router.route('/get_all_doctors').get(patientController.getDoctors)
router.route('/get_all_patient').post(patientController.getPatients)
router.route('/payment').post(patientController.payment)

module.exports = router