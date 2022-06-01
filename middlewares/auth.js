const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const authHeader = req.get("Authorization");
	req.forbidden = true;
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}
	const token = authHeader.split(" ")[1]; // Authorization: Bearer asdmaklsda

	if (!token || token === "") {
		req.isAuth = false;
		return next();
	}

	let decodedToken;
	try {

		let adminKEY = process.env.adminKEY
		decodedToken = jwt.verify(token,adminKEY)
		if(!decodedToken){
			req.isAuth =false;
			return next();
		}
		else{
			req.email = decodedToken.email
			req.type = decodedToken.type
			req.isAuth= true
			return next();
		}
	} catch (error) {
		req.isAuth = false;
			return next();
	}
};
