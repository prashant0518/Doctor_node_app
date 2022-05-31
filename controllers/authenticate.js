const Doctor = require("../models/doctor");
const Patient = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const stripe = require('stripe')(process.env.SECRET_KEY);

exports.adminSignup = async function (req, res, _next) {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const type = req.body.type

    const {fullName,}

    const bCryptPswd = await bcrypt.hash(password + "", 12);
    if (!email || !password || !type) {
        res.status(403).json("Please provide valid inputs");
        return;
    }

    if (type == 'doctor') {

    }
    Doctor.findOne({
        where: {
            // name: {[Op.or]: [businessName, alternateName]}
            email
        }
    }).then(async (bus) => {
        // console.log(bus)
        if (bus) {
            res.status(200).json({
                status: 0,
                code: "DoctorAlreadyExist",
                message: "This doctor already exists."
            });
        } else {
                var adminKEY = process.env.adminKEY;
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
                
                await Doctor.create({ name, adminId: newUser.id, alternateName, hasServices: false, hasClinics: false, hasMembers: false, hasAppointments: false, hasBusiness: false })
                res.status(200).header("token", token).json({
                    status: "1",
                    message: "login successfully",
                    authToken: token,
                    data: userJson,
                });
            
        }

    }
    )
}

