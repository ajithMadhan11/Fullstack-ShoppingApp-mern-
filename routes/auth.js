var express = require('express')
var router = express.Router()
const { check } = require('express-validator');
const {signout,signup,signin} = require("../controllers/auth")


router.post("/signup", [
    check("name","Name should be 3 character").isLength({ min: 3 }),
    check("email","Email is required").isEmail(),
    check("password","password should be atleast 5 character").isLength({ min: 3 }),
], signup)

router.post("/signin", [
    check("email","Email is required").isEmail(),
    check("password","password field is required").isLength({ min: 3 }),
], signin)

router.get("/signout",signout);

module.exports=router;