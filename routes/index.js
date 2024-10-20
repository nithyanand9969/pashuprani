const express = require("express")
const userSignupController = require("../controller/userSignup");
const userLoginController = require("../controller/userSignin");
const router = express.Router()


router.post("/signup",userSignupController)
router.post("/login", userLoginController);


module.exports = router