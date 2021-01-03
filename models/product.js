const {Schema,model} = require('mongoose');

const productSchema = new Schema({
    title:{
      type:String,
      required:true
    },
    price:{
      type:Number,
      required:true
    },
    imageUrl:{
      type:String,
      required:true
    }
  },{
      timestamps:false
  })

  module.exports = model('Product',productSchema)