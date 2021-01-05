require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')


const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/orders')

const corsOptions = {
    origin:'*',
    methods:['GET','PUT','POST'],
    allowedHeaders:['Content-Type','Authorization']
}

const app = express();

const arr = [];

app.use(express.static('public'))
app.use(cors(corsOptions),(req,res,next)=>{
    next();
})
app.use(bodyParser.json())
app.use(productsRoutes)
app.use(cartRoutes)
app.use(authRoutes)
app.use(userRoutes)
app.use(orderRoutes)
app.use((error,req,res,next)=>{
    const status = error.statusCode||500;
    const message = error.message;
    const data = error.data||null
    res.status(status).json({message,data})
})

// app.listen(8080);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.bzsgk.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,{ useNewUrlParser: true ,useUnifiedTopology: true })
        .then(data=>{
            const server = app.listen(process.env.PORT||8080);
            const io = require('socket.io')(server,{
                cors: {
                  origin: "*",
                  methods: ["GET", "POST"]
                }
              })
            io.on('connection',socket => {
                console.log('client connected')
                arr.push(socket.handshake.query.token)
                socket.join(socket.handshake.query.token);
                socket.broadcast.to(arr[0]).emit('message',"This is what i want")
            })
        })
        .catch(err=>{
          console.log(err)
        })