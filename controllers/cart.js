const Product = require("../models/product");

exports.getCart = (req, res, next) => {
  const arr = req.body;
  let cartDetails = []
  let totalPrice = 0;
  Product.find({
    _id: {
      $in: arr.map(data=>data.productID),
    },
  }).then((data) =>{
      cartDetails=arr.map(element => {
          const item = data.find(e=>e._id.toString()===element.productID.toString());
          const quantityPrice = element.itemQuantity*item.price
          totalPrice = totalPrice + quantityPrice
          const obj = {_id:item._id,price:item.price,imageUrl:item.imageUrl,title:item.title,quantityPrice,itemQuantity:element.itemQuantity}
          // console.log(obj)
          return obj
      });
      return cartDetails
  }).then(cartDetails=>{
    //   console.log(cartDetails)
      res.status(200).json({cartDetails,totalPrice})
  })
};
