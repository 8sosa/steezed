const Orders = require('../models/orderModel');
const Shopper = require('../models/shopperModel');
const https = require('https')


const checkoutCtrl = {
  createPaymentIntent: async (req, res) => {
    try {
      const {orderId} = req.body
      const order = await Orders.findById(orderId)
      const shopper = await Shopper.findById(order.shopper)

      const params = JSON.stringify({
        "email": shopper.email,
        "amount": "" + ( order.totalPrice * 100),
        "callback_url" : "http://localhost:3000/pay/"+orderId
      })

      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + process.env.PAY_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }

      const paymentRequest = https.request(options, paymentResult => {
        let data = ''

        paymentResult.on('data', (chunk) => {
          data += chunk
        });
      
        paymentResult.on('end', async () => {
          const parsedData = JSON.parse(data);
          const reference = parsedData.data.reference;

          order.payment.push({
            paymentAmount: order.totalPrice,
            reference,
            paymentStatus: parsedData.status ? 'Success' : 'Failed',
          });
          await order.save();

          res.json(parsedData);
        })
      }).on('error', error => {
        console.error(error)
        res.JSON(JSON.parse(error))
      })

      paymentRequest.write(params)
      paymentRequest.end()

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  verifyPayment: async (req, res)=> {
    try {
      const order = await Orders.findById(req.params.orderid)
      if (!order.payment || order.payment.length === 0) {
        return res.status(400).json({ msg: 'No payment found for this order' });
      }
      // Get the most recent payment reference
      const mostRecentPayment = order.payment[order.payment.length - 1];
      const reference = mostRecentPayment.reference;

      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/verify/' + reference,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + process.env.PAY_SECRET_KEY
        }
      }

      https.request(options, res => {
        let data = ''
      
        res.on('data', (chunk) => {
          data += chunk
        });
      
        res.on('end', () => {
          console.log(JSON.parse(data))
        })
      }).on('error', error => {
        console.error('error',error)
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message})
    }
  },
  paymentSuccess: async (req, res)=> {
    res.json('Payment successful, come again!')
  },
  paymentCancel: async (req, res)=> {
    res.json('Payment canceled, try again?')
  }
};

module.exports = checkoutCtrl;