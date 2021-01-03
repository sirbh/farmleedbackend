const express = require('express')


const cartControler = require('../controllers/cart')

const router = express.Router();

router.post('/cart',cartControler.getCart)

module.exports = router;