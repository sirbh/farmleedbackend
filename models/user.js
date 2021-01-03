const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    name:{
      type:String,
      required:true
    },
    phone:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    cart:{
      cartItems:[{
        productID:{
          type:Schema.Types.ObjectId,
          required:true,
          refer:'Product'
        },
        itemQuantity:{
          type:Number,
          required:true
        }
      }],
      totalItems:{
        type:Number,
        required:true
      }
    }
  },{
      timestamps:false
  })

  module.exports = model('User',userSchema)