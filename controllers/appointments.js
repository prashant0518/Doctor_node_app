



exports.addBusinessAppointment = async function (req, res, _next) {
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