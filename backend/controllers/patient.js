const Appointment = require("../models/appointment");
const Patient = require("../models/user");
const Doctor = require("../models/doctor");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// exports.getPatients = async function(req,res){
//     if (!req.isAuth) {
//         res.status(401).json("Unauth request");
//         return;
//     }

//      const email = req.email
//     // const {doctorId} = req.query

//     try {
//         const doctor = await Doctor.findOne({where:{email}})
//         const allPatients = await Patient.findAll({where:{memberId:doctor.id}})
//         if(allPatients){
//             res.status(200).json({status:1,message:'All patients fetched successfully',data:allPatients})
//         }else{
//             res.status(200).json({status:1,message:'no patients found',data:[]})
//         }

//     } catch (error) {
//         res.status(200).json({status:0,message:'something went wrong',data:error})
        
//     }
// }


exports.getData = async function(req,res){
    if (!req.isAuth) {  
        res.status(401).json("Unauth request");
        return;
    }
    const userType = req.type;
    const email = req.email
    try {
        if(userType=='patient'){
            const patient =await Patient.findOne({where:{email},attributes:{exclude:['password']}})
            const patientJson = JSON.parse(JSON.stringify(patient))
            patientJson.userType = 'patient'
            const allDoctors = await Doctor.findAll()
            if(allDoctors){
                res.status(200).json({status:1,message:'All doctors fetched successfully',allAppointments:allDoctors,user:patientJson,})
            }else{
                res.status(200).json({status:1,message:'no doctor found',data:[]})
            }
        }else{
            res.status(200).json({status:1,message:'no patients found',data:[]})
            // const doctor = await Doctor.findOne({where:{email},attributes:{exclude:['password']}})
            // const doctorJson = JSON.parse(JSON.stringify(doctor))
            // doctorJson.userType = 'doctor'
            // const allAppointments = await Appointment.findAll({where:{doctorId:doctor.id}})
            // if(allAppointments){
            //     res.status(200).json({status:1,message:'All appointments fetched successfully',allAppointments ,user:doctorJson})
            // }else{
            // }
        }

    } catch (error) {
        res.status(200).json({status:0,message:'something went wrong',data:error})
        
    }
}



exports.payment = async (req, res) => {
    // if (!req.isAuth) {
    //     res.status(401).json("Unauth request");
    //     return;
    // }
    const { appointmentId, success_url, cancel_url  } = req.body;
    const email = req.email

    // const business = await Business.findOne({ where: { adminId: adminId } })
    // const plan = await Plan.findOne({ adminId: adminId })


    try {
        const appointment =await Appointment.findOne({where:{id:appointmentId}})
        const doctor = await Doctor.findOne({where:{id:appointment.doctorId}})
        const session = await stripe.checkout.sessions.create({
            success_url: success_url,
            cancel_url: cancel_url,
            line_items: [
              {price: doctor.priceId, quantity: 1},
            ],
            mode: 'payment',
          });

          res.status(200).json({status:1,message:'stripe url',data:session})

    } catch (error) {
        console.log('err', error.message)
        if (error.decline_code == 'insufficient_funds') {
            res.status(400).json({ status: 0, message: error.decline_code, code: error.code, data: error });
        } else if (error.message == 'Amount for an export transaction must be less than $10,000.00.') {
            res.status(400).json({ status: 0, message: error.message, code: 'AmountExceedLimit', data: error });

        }
        else {
            res.status(500).json({ status: 0, message: error.decline_code, code: error.code, data: error });

        }
        // res.status(500).json({ status: 0, message: "something went wrong", code: 'StripeGetError', data: error });

    }


}

exports.confirm = async function(req,res){
     // if (!req.isAuth) {
    //     res.status(401).json("Unauth request");
    //     return;
    // }
    const email = req.email

    try {
        // const patient = Patient.findOne({where:{email:email}})
        // const appointment = await Appointment.findAll({where:{patientId:patient.id}})
        const paymentIntent = await stripe.paymentIntents.confirm(
            // appointment.paymentIntent,
            "pi_3L6FymSHwS1VUCaV1G2jcXKJ",
          );
          res.status(200).json({status:1,data:paymentIntent})
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 0, message: 'something went wrong', data: error });

    }
}