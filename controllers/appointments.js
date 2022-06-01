const Appointment = require("../models/appointment");
const Patient = require("../models/user");
const Doctor = require("../models/doctor");





exports.addAppointment = async function (req, res, _next) {
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }

    const { date, time,  patientDetails ,doctorId } = req.body;

    const userType = req.type;
    const email = req.email


    Patient.findOne({
        where: {
            email,
        },
        // attributes: ["firstName", "lastName", "phone", "email", "isEmailVerified", "isPhoneVerified", "isActive"],

    }).then(async (user) => {
        if (user) {
           
            // const {email} = patientDetails 
            const { phoneNumber, patientName } = patientDetails
            
            const appointmentExist = await Appointment.findOne({ where: { patientId:user.id, date, time ,doctorId } })
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
                appointment_date,doctorId, appointment_time, patientId:user.id, approval_status: 'waiting',payment_status:'not paid'
            });

            res.status(200).json({
                status: 1,
                code: "AppointmentAddSuccess",
                message: "Appointment added to business successfully",
                data: patient
            });
        }else{
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

exports.getAppointment = async function(req,res){
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }

    const userType = req.type
    const email = req.email

    if(userType =='doctor'){
        const doctor =await Doctor.findOne({where:{email}})
        if(doctor){
            const appointments = await Appointment.findAll({where:{doctorId:doctor.id}})
            res.status(200).json({status:1,code:'AppointmentFetchedSuccesfully',message:"Doctor appointment fetched successfully",data:appointments})
        }else{
            res.status(200).json({status:0,code:'DoctorNotExist',message:"This Doctor is not exist"})

        }
    }else{
        const patient =await Patient.findOne({where:{email}})
        if(patient){
            const appointments = await Appointment.findAll({where:{patientId:patient.id}})
            res.status(200).json({status:1,code:'AppointmentFetchedSuccesfully',message:"Patient appointment fetched successfully",data:appointments})
        }else{
            res.status(200).json({status:0,code:'PatientNotExist',message:"This Patient is not exist"})

        }
    }
}

exports.updateAppointment=async function(req,res){
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }

    const userType = req.type
    const email = req.email
    const appointmentId = req.appointmentId
    const {patientDetails} = req.body
    if(userType =='doctor'){
        const doctor =await Doctor.findOne({where:{email}})
        if(doctor){
            const appointment = await Appointment.findOne({where:{id:appointmentId}})
            appointment.approval_status ='confirmed'
           await appointment.save();
            res.status(200).json({status:1,code:'AppointmentUpdatedSuccesfully',message:"Doctor appointment updated successfully",data:appointments})
        }else{
            res.status(200).json({status:0,code:'DoctorNotExist',message:"This Doctor is not exist"})

        }
    }else{
        const patient =await Patient.findOne({where:{email}})
        if(patient){
            const {time,date,doctorId} = patientDetails
            const appointment = await Appointment.findOne({where:{id:appointmentId}})
            appointment.appointment_time = time
            appointment.appointment_date = date
            appointment.doctorId = doctorId
            await appointment.save();
            // appointment_date,doctorId, appointment_time, patientId:user.id, approval_status: 'waiting',payment_status:'not paid'
            res.status(200).json({status:1,code:'AppointmentFetchedSuccesfully',message:"Patient appointment fetched successfully",data:appointments})
        }else{
            res.status(200).json({status:0,code:'PatientNotExist',message:"This Patient is not exist"})

        }
    }

}

exports.deleteAppointment = async function(req,res){
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }
    const {appointmentId} = req.body

    const appointment = await Appointment.destroy({where:{id:appointmentId}})
    if(appointment){
        res.status(200).json({status:1,code:'AppointmentDeletedSuccesfully',message:"Appointment deleted successfully",data:appointment})
    }else{
        res.status(200).json({status:0,code:'AppointmentNotFound',message:"Appointment not found",data:appointment})

    }
}