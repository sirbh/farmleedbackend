const express = require('express')


const productsController = require('../controllers/products')

const router = express.Router();

router.get('/products',productsController.getProducts)
router.post('/post',productsController.postProducts)
router.post('/queryproducts',productsController.queryProducts)
// router.get('/add',productsController.addProducts)

module.exports = router;