var express = require("express");
var router = express.Router();
const appointmentController = require("../controllers/appointments.js");
// const isAuthAdmin = require("../middleware/is-adminAuthApi");


router.route("/appointment").get(appointmentController.getAppointment).post(appointmentController.addAppointment)
.delete(appointmentController.deleteAppointment).patch(appointmentController.updateAppointment)


module.exports = router