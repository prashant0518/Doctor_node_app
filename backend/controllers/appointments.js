const Appointment = require("../models/appointment");
const Patient = require("../models/user");
const Doctor = require("../models/doctor");
// const Member = require("../models/doctor");





exports.addAppointment = async function (req, res, _next) {
    const userType = req.type;
    console.log(userType)
    if (!req.isAuth || userType !== 'patient') {
        res.status(401).json("Unauth request");
        return;
    }

    let { date, time, doctorId } = req.body;

    const email = req.email

    const timez = time.split(':')
    if (timez[1] >= 1 && timez[1] <= 8) time = `${timez[0]}:00 `
    else if (timez[1] > 8 && timez[1] <= 23 ) time = `${timez[0]}:15 `
    else if (timez[1] > 23 && timez[1] <= 38) time = `${timez[0]}:30 `
    else if (timez[1] >38  && timez[1] <= 53) time = `${timez[0]}:45 `
    else time = `${timez[1] + 1}:00`


    Patient.findOne({
        where: {
            email,
        },
        // attributes: ["firstName", "lastName", "phone", "email", "isEmailVerified", "isPhoneVerified", "isActive"],

    }).then(async (user) => {
        if (user) {

            // const {email} = patientDetails 
            // const { phoneNumber, patientName } = patientDetails

            const appointmentExist = await Appointment.findOne({ where: { patientId: user.id, appointment_date: date, appointment_time: time } })
            if (appointmentExist) {
                return res.status(200).json({
                    status: 0,
                    code: "AppointmentAlreadyExist",
                    message: "Appointment already exist"
                })
            }
            // const BIData = await BusinessInsurance.findOne({ where: { insuranceId } })
            const patient = await Appointment.create({
                isActive: true,
                appointment_date: date, doctorId, appointment_time: time, patientId: user.id, approval_status: 'waiting', payment_status: 'not paid'
            });

            res.status(200).json({
                status: 1,
                code: "AppointmentAddSuccess",
                message: "Appointment added to business successfully",
                data: patient
            });
        } else {
            res.status(200).json({
                status: 0,
                code: "UserNotExist",
                message: "This User is not exist",
            });
        }
    }).catch(error => {
        console.log(error)
        res.status(500).json({ status: 0, code: "AdminGetError", message: "Something went wrong.", error });
    })
}

exports.getAppointment = async function (req, res) {
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }

    const userType = req.type
    const email = req.email

    if (userType == 'doctor') {
        const doctor = await Doctor.findOne({ where: { email } })
        const docJson =  JSON.parse(JSON.stringify(doctor))
        docJson.userType = 'doctor'
        if (doctor) {
            const appointments = await Appointment.findAll({ where: { doctorId: doctor.id },include: [{ model: Patient, attributes: ['name', 'id', 'isActive'] }]  })
            res.status(200).json({ status: 1, code: 'AppointmentFetchedSuccesfully', message: "Doctor appointment fetched successfully", data: {appointment:appointments,user:docJson} })
        } else {
            res.status(200).json({ status: 0, code: 'DoctorNotExist', message: "This Doctor is not exist" })

        }
    } else {
        const patient = await Patient.findOne({ where: { email } })
        if (patient) {
            const appointments = await Appointment.findAll({ where: { patientId: patient.id }, include: [{ model: Doctor, attributes: ['name', 'id', 'fee'] }] })
            res.status(200).json({ status: 1, code: 'AppointmentFetchedSuccesfully', message: "Patient appointment fetched successfully", data: {appointment:appointments} })
        } else {
            res.status(200).json({ status: 0, code: 'PatientNotExist', message: "This Patient is not exist" })

        }
    }
}

exports.updateAppointment = async function (req, res) {
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }

    const userType = req.type
    const email = req.email
    const appointmentId = req.body.appointmentId
    const { time, date } = req.body
    if (userType == 'doctor') {
        const doctor = await Doctor.findOne({ where: { email } })
        if (doctor) {
            const appointment = await Appointment.findOne({ where: { id: appointmentId } })
            appointment.approval_status = 'confirmed'
            await appointment.save();
            res.status(200).json({ status: 1, code: 'AppointmentUpdatedSuccesfully', message: "Doctor appointment updated successfully", data: appointment })
        } else {
            res.status(200).json({ status: 0, code: 'DoctorNotExist', message: "This Doctor is not exist" })

        }
    } else {
        const patient = await Patient.findOne({ where: { email } })
        if (patient) {
            // const {time,date} = patientDetails
            const appointment = await Appointment.findOne({ where: { id: appointmentId } })
            appointment.appointment_time = time
            appointment.appointment_date = date
            await appointment.save();
            // appointment_date,doctorId, appointment_time, patientId:user.id, approval_status: 'waiting',payment_status:'not paid'
            res.status(200).json({ status: 1, code: 'AppointmentFetchedSuccesfully', message: "Patient appointment fetched successfully", data: appointment })
        } else {
            res.status(200).json({ status: 0, code: 'PatientNotExist', message: "This Patient is not exist" })

        }
    }

}

exports.deleteAppointment = async function (req, res) {
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }
    const { appointmentId } = req.query
try {
    
    const appointment = await Appointment.destroy({ where: { id: appointmentId } })
    if (appointment) {
        res.status(200).json({ status: 1, code: 'AppointmentDeletedSuccesfully', message: "Appointment deleted successfully", data: appointment })
    } else {
        res.status(200).json({ status: 0, code: 'AppointmentNotFound', message: "Appointment not found", data: appointment })

    }
} catch (error) {
    console.log(error)
    res.status(500).json({ status: 0, code: "AdminGetError", message: "Something went wrong.", error });
}
}