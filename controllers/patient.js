const Appointment = require("../models/appointment");
const Patient = require("../models/user");
const Doctor = require("../models/doctor");


exports.getPatients = async function(req,res){
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }


    const {doctorId} = req.body

    try {
        
        const allPatients = await Patient.findAll({where:{doctorId:doctorId}})
        if(allPatients){
            res.status(200).json({status:1,message:'All patients fetched successfully',data:allPatients})
        }else{
            res.status(200).json({status:1,message:'no patients found',data:[]})
        }

    } catch (error) {
        res.status(200).json({status:0,message:'something went wrong',data:error})
        
    }
}


exports.getDoctors = async function(req,res){
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }

    try {
        
        const allDoctors = await Doctor.findAll()
        if(allDoctors){
            res.status(200).json({status:1,message:'All doctors fetched successfully',data:allDoctors})
        }else{
            res.status(200).json({status:1,message:'no doctor found',data:[]})
        }

    } catch (error) {
        res.status(200).json({status:0,message:'something went wrong',data:error})
        
    }
}

exports.payment = async (req, res) => {
    if (!req.isAuth) {
        res.status(401).json("Unauth request");
        return;
    }
    const { charge, success_url, cancel_url } = req.body;
    const email = req.email

    // const business = await Business.findOne({ where: { adminId: adminId } })
    // const plan = await Plan.findOne({ adminId: adminId })


    try {

        
        const subcriptionData = await Subscription.findOne({ where: { businessId: business.id } })
        if (subcriptionData) {
            await Subscription.destroy({ where: { adminId: adminId } })
            await WebHookTable.destroy({ where: { adminId: adminId } })
            await UserStripePayment.destroy({ where: { adminId: adminId } })
        }
        let customerData = {}
        let memberPriceId = process.env.MEMBER_PRICE_ID
        let clinicPriceId = process.env.CLINIC_PRICE_ID
        let memberProductId = process.env.MEMBER_PRODUCT_ID
        let clinicProductId = process.env.CLINIC_PRODUCT_ID
        // let planDetails ={}
        //     // res.status(400).json({ status: 0, code: "AlreadyHasPlan", message: 'This business has already plan' })
        //     if(!planData){
        //         const businessData = await Business.findOne({ where: { adminId: adminId } })
        //         businessData.clinicLimit = clinics
        //         businessData.doctorLimit = members
        //         await businessData.save();
        //         const plan = await stripe.plans.create({
        //             amount: amount,
        //             currency: 'usd',
        //             interval: 'month',
        //             product: {
        //                 name: `${adminId} product`
        //             },
        //             nickname: `${adminId}-${admin.firstName}`
        //         });

        //         const addPlan = await Plan.create({ name: plan.nickname, price: plan.amount, plan_id: plan.id, isActive: true, adminId: adminId, extras: plan })
        //         planDetails=plan;
        //     }else{
        //         planDetails=planData
        //     }


        //     console.log('a',planDetails)

        const priceMember = await stripe.prices.retrieve(
            memberPriceId
        );
        const priceClinic = await stripe.prices.retrieve(
            clinicPriceId
        );
        memberPriceId = priceMember.id
        clinicPriceId = priceClinic.id

        if (priceData) {
            const customer = await stripe.customers.retrieve(
                priceData.name
            );
            customerData = customer

        } else {
            const customer = await stripe.customers.create({
                email: admin.email
            })
            customerData = customer
        }




        if (!priceData) {
            const price = await Price.create({ clinics, members, memberPriceId: memberPriceId, isActive: false, clinicPriceId: clinicPriceId, memberProductId: memberProductId, clinicProductId: clinicProductId, adminId: adminId, name: customerData.id })
        } else {
            priceData.clinics = clinics
            priceData.members = members
            priceData.isActive = false
            await priceData.save()
            console.log('$%%$%$', priceData.isActive)


        }
        //  console.log('aa',price)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'subscription',
            customer: customerData.id,
            billing_address_collection: 'required',
            line_items: [
                {
                    price: memberPriceId,
                    quantity: members,
                },
                {
                    price: clinicPriceId,
                    quantity: clinics,
                },
            ],
            success_url: success_url,
            cancel_url: cancel_url,
        })
        res.status(200).json({ url: session.url, sessionId: session.id })

        // const customer = await stripe.customers.create({
        //     payment_method: payment_method,
        //     email: email,
        //     invoice_settings: {
        //         default_payment_method: payment_method,
        //     },
        // });


        // const subscription = await stripe.subscriptions.create({
        //     customer: customer.id,
        //     items: [{ plan: plan.plan_id }],
        //     expand: ['latest_invoice.payment_intent'],


        // });
        // console.log('subscription', subscription)
        // const status = subscription['latest_invoice']['payment_intent']['status']
        // const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

        // console.log('saa', subscription.latest_invoice.payment_intent.next_action.type)
        // const subscriptionAdd = await Subscription.create({ fromDate: subscription.current_period_start, toDate: subscription.current_period_end, customer_id: subscription.latest_invoice.customer, subcriptionId: subscription.id, isActive: true, planId: plan.id, businessId: business.id })
        //   const paymentIntentData = await stripe.paymentIntents.confirm(
        //             subscription.latest_invoice.payment_intent.id,{payment_method: 'pm_card_visa'}
        //           );

        //    console.log('peet',paymentIntentData)
        // res.status(200).json({ 'client_secret': client_secret, 'status': status });

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