const express = require("express");

const authMiddleware = require('../middlewares/is-auth')

const OrderController = require('../controllers/order')


const router = express.Router();


router.get('/currentorder',authMiddleware,OrderController.getCurrentOrder)
router.get('/confirmorder',authMiddleware,OrderController.confirmOrder)
router.get('/getorders',authMiddleware,OrderController.getOrders)
router.get('/getpendingorders',authMiddleware,OrderController.getPendingOrders)
router.post('/updateorder',authMiddleware,OrderController.postUpdate)
// router.post("/login", loginValidation, authController.login);
// router.post("/setcart", authMiddleware, authController.setCart);
 
module.exports = router;
