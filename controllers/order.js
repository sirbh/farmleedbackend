const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/product')

exports.getCurrentOrder = (req,res,next)=>{
    const userId = req.userId
    let arr ;
    let cartDetails = []
    let totalPrice = 0;
    User.findById(userId)
        .then(user=>{
            arr = user.cart.cartItems
            return user.cart.cartItems
        })
        .then(cart=>{
            return Product.find({  
                _id: {
                  $in: cart.map(data=>data.productID),
                },
              })
        })
        .then(data=>{
            cartDetails=arr.map(element => {
                const item = data.find(e=>e._id.toString()===element.productID.toString());
                const quantityPrice = element.itemQuantity*item.price
                totalPrice = totalPrice + quantityPrice
                const obj = {price:item.price,imgUrl:item.imageUrl,title:item.title,itemPrice:quantityPrice,quantity:element.itemQuantity}
                // console.log(obj)
                return obj
            });
            // const orders = new Order({
            //   status:{
            //       category:'Recieved',
            //       message:'Order Recieved'
            //   },
            //   orderDetails:{
            //       products:cartDetails,
            //       totalPrice
            //   },
            //   userId
            // })
            // return orders.save()
            console.log(cartDetails)
            res.status(200).json({cartDetails,totalPrice})
        })
        // .then(data=>{
        //     console.log('ggoo'+data+'ggoo')
        // })
        .catch(err=>{
            if(!err.statusCode)
            {
                err.statusCode = 500
            }
            next(err)
        })

}

exports.confirmOrder = (req,res,next)=>{
    const userId = req.userId
    let arr ;
    let cartDetails = []
    let totalPrice = 0;
    User.findById(userId)
        .then(user=>{
            arr = user.cart.cartItems
            return user.cart.cartItems
        })
        .then(cart=>{
            return Product.find({  
                _id: {
                  $in: cart.map(data=>data.productID),
                },
              })
        })
        .then(data=>{
            cartDetails=arr.map(element => {
                const item = data.find(e=>e._id.toString()===element.productID.toString());
                const quantityPrice = element.itemQuantity*item.price
                totalPrice = totalPrice + quantityPrice
                const obj = {price:item.price,imgUrl:item.imageUrl,title:item.title,itemPrice:quantityPrice,quantity:element.itemQuantity}
                // console.log(obj)
                return obj
            });
            const orders = new Order({
              status:{
                  category:'Pending',
                  message:'Order Recieved',
                  flag:1
              },
              orderDetails:{
                  products:cartDetails,
                  totalPrice
              },
              userId
            })
            return orders.save()
            // console.log(cartDetails)
            // res.status(200).json({cartDetails,totalPrice})
        })
        .then(data=>{
            res.status(200).json({cartDetails,totalPrice,orderId:data._id})
        })
        .catch(err=>{
            if(!err.statusCode)
            {
                err.statusCode = 500
            }
            next(err)
        })

}

exports.getOrders = (req,res,next)=>{
    Order.find({userId:req.userId})
         .then(data=>{
             console.log(data)
             res.status(200).json({orders:data})
         })
         .catch(err=>{
            next(err)
         })
}
exports.getPendingOrders = (req,res,next)=>{
    Order.find({userId:req.userId,'status.category':'Pending'})
         .then(data=>{
             console.log(data)
             res.status(200).json({pendingOrders:data})
         })
         .catch(err=>{
            next(err)
         })
}

exports.postUpdate = (req,res,next)=>{

    Order.findOne({userId:req.userId,_id:req.body.id})
         .then(data=>{
            //  console.log(data[0])
             data.status.category = 'Cancaled';
             data.status.message = 'order cancaled';
             data.status.flag = -1;
             
             console.log(data)
             return data.save()

         }) 
         .then(data=>{
             console.log('data',data)
             res.status(200).json({message:'Order cancaled succesfully'})
         })
         .catch(err=>{
             console.log(err)
             next(err)
         })
}
