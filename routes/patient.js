var express = require("express");
var router = express.Router();
const patientController = require("../controllers/patient");
// const isAuthAdmin = require("../middleware/is-adminAuthApi");


router.route('/get_Data').get(patientController.getData)
// router.route('/get_all_patient').get(patientController.getPatients)
router.route('/payment').post(patientController.payment)
router.route('/confirm').get(patientController.confirm)


module.exports = router