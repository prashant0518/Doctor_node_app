const Doctor = require("../models/doctor");
const Patient = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.signup = async function (req, res, _next) {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const type = req.body.type

    const { name,fee,status } = req.body

    if (!email || !password || !type) {
        res.status(403).json("Please provide valid inputs");
        return;
    }
    try {
        
        const bCryptPswd = await bcrypt.hash(password + "", 12);
        const isDoctorAlreadyExist = await Doctor.findOne({ where: { email } })
        const isPatientAlreadyExist = await Patient.findOne({ where: { email } })
    
        if (isDoctorAlreadyExist) return res.status(200).json({ status: 1, code: 'DoctorAlreadyExist', message: 'This Doctor already exist' })
        if (isPatientAlreadyExist) return res.status(200).json({ status: 1, code: 'PatientAlreadyExist', message: 'This Patient already exist' })
    
        var adminKEY = process.env.adminKEY
    
        const token = jwt.sign(
            {
                email: email,
                type: type
            },
            adminKEY,
            {
                expiresIn: "24h",
            }
        )
    
        if(type =='doctor'){
            const product = await stripe.products.create({
                name: `${name}Fees`,
              });
            const price = await stripe.prices.create({
                unit_amount: fee*100,
                currency: 'usd',
                product: product.id,
              });
            console.log("price",product,price)
            await Doctor.create({ name:name, fee:fee,status:'active',password:bCryptPswd,email:email,productId:product.id,priceId:price.id})
                 return      res.status(200).header("token", token).json({
                            status: "1",
                            message: "login successfully",
                            authToken: token,
                            data: {email:email,name:name,status:'active',consultationFee:fee},
                        });
        
        }
        if(type=="patient"){
            await Patient.create({ name:name,status:'active',password:bCryptPswd,email:email,isActive:true,phone:""})
          return  res.status(200).header("token", token).json({
                status: "1",
                message: "Register successfully",
                authToken: token,
                data: {email:email,name:name,status:'active'}
            });
    
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0,message:'something went wrong'})
    }

}

exports.login =async(req,res,_next)=>{

    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const type = req.body.type

    if (!email || !password || !type) {
        res.status(403).json("Please provide valid inputs");
        return;
    }
   
    if(type==='doctor'){
        const doctor = await Doctor.findOne({ where: { email } })
        if (!doctor) return res.status(200).json({ status: 0, code: 'DoctorNotExist', message: 'This Doctor is not exist' })
        else {
            const userJsn = JSON.parse(JSON.stringify(doctor));
                const isEqual = await bcrypt.compare(
                    password,
                    userJsn.password
                );
                if (isEqual) {
                    var adminKEY = process.env.adminKEY;
                    // console.log(user)
                    token = jwt.sign(
                        {
                        email:email,
                        type:type
                        },
                        adminKEY,
                        {
                            expiresIn: "24h",
                        }
                    );
                    delete userJsn.password;

                    res.status(200).header("token", token).json({
                        status: "1",
                        message: "login successfully",
                        authToken: token,
                        data: userJsn,
                    });
                } else {
                    res.status(200).json({
                        status: 0,
                        message: "Your email or password is not correct",
                    });
                }
        }    
    }else{
        const patient = await Patient.findOne({ where: { email } })
        if (!patient) return res.status(200).json({ status: 0, code: 'PatientNotExist', message: 'This Patient is not exist' })
        else {
            const userJsn = JSON.parse(JSON.stringify(patient));
                const isEqual = await bcrypt.compare(
                    password,
                    userJsn.password
                );
                if (isEqual) {
                    var adminKEY = process.env.adminKEY;
                    // console.log(user)
                    token = jwt.sign(
                        {
                        email:email,
                        type:type
                        },
                        adminKEY,
                        {
                            expiresIn: "24h",
                        }
                    );
                    delete userJsn.password;

                    res.status(200).header("token", token).json({
                        status: "1",
                        message: "login successfully",
                        authToken: token,
                        data: userJsn,
                    });
                } else {
                    res.status(200).json({
                        status: 0,
                        message: "Your email or password is not correct",
                    });
                }
        }  
    }
    

}
