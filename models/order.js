const {Schema,model} = require('mongoose');

const orderSchema = new Schema({
    userId:{
      type:Schema.Types.ObjectId,
      required:true,
      refer:'User'
    },
    status:{
      category:{
          type:String,
          required:true
      },
      message:{
          type:String,
          required:true
      },
      flag:{
          type:Number,
          required:true
      }
    },
    orderDetails:{
        products:[{
            quantity:{
                type:Number,
                required:true
            },
            itemPrice:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            imgUrl:{
                type:String,
                required:true
            },
            title:{
                type:String,
                required:true
            }
        }],
        totalPrice:{
            type:Number,
            required:true
        }
    }
  },{
      timestamps:true
  })

  module.exports = model('Order',orderSchema)