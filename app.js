const dotenv = require("dotenv");
// dotenv.config({ path: "/opt/shedassist-dev/.env" });
const bodyParser = require("body-parser");
var express = require("express");
const { Op } = require("sequelize");
const cors = require('cors');
const Patient = require('./models/user')
const Appointment = require('./models/appointment')
const Doctor = require('./models/doctor')
const patientRoute = require("./routes/patient");
const doctorRoute = require("./routes/doctor");
const authRoute = require('./routes/authenticate')

app.use(
  bodyParser.json({
    extended: false,
    limit: "50mb",
  })
);

var app = express();
app.use(cors())
app.use(isAuth);

var http = require("http").Server(app);
var port = process.env.PORT || 4100;

app.use('/auth',authRoute)
app.use("/patient", patientRoute);
app.use("/doctor", doctorRoute);


app.start = app.listen = function () {
  return server.listen.apply(server, arguments);
};

http.listen(port, function () {
  console.log("listening on *:" + port);
});

Patient.hasMany(Appointment);
Doctor.hasMany(Patient)
Doctor.hasMany(Appointment)




// sequelize
//   .sync({force: false})
//   .then((result) => {})
//   .catch((err) => {
//       console.log(err);
//   });
module.exports = app