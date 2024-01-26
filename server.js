require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer  = require('multer')
const path = require('path')


  const adminRouter = require('./routes/adminRouter')
  const shopperRouter = require('./routes/shopperRouter')
  const sellerRouter = require('./routes/sellerRouter')
  const productRouter = require('./routes/productRouter')
  const categoryRouter = require('./routes/categoryRouter')
  const wishlistRouter = require('./routes/wishlistRouter')
  const orderRouter = require('./routes/orderRouter')
  const cartRouter = require('./routes/cartRouter')
  const checkoutRouter = require('./routes/checkoutRouter')



const app = express()
app.use(express.static("public"));
app.use(express.json( { limit: '20mb' } ))
app.use(cors())


//ROUTES
app.use('/secret/admin', adminRouter)
app.use('/shopper', shopperRouter)
app.use('/seller', sellerRouter)
app.use('/api/products', productRouter)
app.use('/category', categoryRouter)
app.use('/order', orderRouter)
app.use('/wishlist', wishlistRouter)
app.use('/cart', cartRouter)
app.use('/checkout', checkoutRouter)

const PORT = process.env.PORT
const URI = process.env.MONGODB_URL
app.listen(PORT, () => {
  console.log('~Server running on port', PORT , 'Senpai!~')
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('~Connected to the database!~');
  })
  .catch((error) => {
    console.error('~Error connecting to the database:', error, '~');
  });
})