const Product = require('../models/product')

exports.getProducts = (req,res,next)=>{
    Product.find()
           .then((products)=>{
               res.status(200).json(products)
           })
           .catch(err=>{
               if(!err.statusCode)
               {
                   err.statusCode = 500
               }
               next(err)
           })
}

exports.postProducts = (req,res,next)=>{
    res.json(req.body)
}
exports.queryProducts = (req,res,next)=>{
    const query = req.body.query||'';
    Product.find({title:{$regex:query.toString().trim(),$options:'i'}})
           .then(products=>{
            res.status(200).json(products)
           })
           .catch(err=>{
               console.log(err)
           })
}

// exports.addProducts = (req,res,next) =>
// {
//     const products =  [
//         {
//           imageUrl: '/images/potato.jpg',
//           price: 25,
//           name: "Potato 1Kg",
//         },
//         {
//           imageUrl:  '/images/tomato.jpg',
//           price: 30,
//           name: "Tomato 1Kg",
//         },
//         {
//           imageUrl: '/images/onion.jpg',
//           price: 35,
//           name: "Onion 1Kg",
//         }
//       ];

//       products.forEach(element => {
//           const prod = new Product({
//               title:element.name,
//               price:element.price,
//               imageUrl:element.imageUrl
//           })

//           prod.save().then(data=>console.log('success'));
//       });
// }