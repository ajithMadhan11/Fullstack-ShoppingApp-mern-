const express = require("express")
const router = express.Router();

const {isSignedIn,isAuthenticated,isAdmin}= require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList}= require("../controllers/user")
const{updateProduct}=require("../controllers/product")

const{getorderById,createOrder,getAllOrders,getOrderStatus,updateStatus} = require("../controllers/order");
const { param } = require("./auth");

//params
router.param("userId",getUserById)
router.param("orderId",getorderById)

// create routes
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateProduct,createOrder)

//read routes
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//status of Order routes
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin ,updateStatus)


module.exports = router;