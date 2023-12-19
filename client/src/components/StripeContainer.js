import React, {useEffect} from 'react'
import { redirect } from 'react-router-dom';
import axios from 'axios'

export default function StripeContainer({orderId}) {

  const createPaymentIntent = async () => {
    try {
      const res = await axios.post('/checkout', {orderId})
      console.log(res.data)
      if(res.data.status === true){
        redirect(res.data.data.authorization_url)
      }
      //setClientSecret(res.data.clientSecret)
    } catch (error) {
        console.log(error)
    }
  };


  useEffect(() => {
    createPaymentIntent()
  })

  return (
    <>
      {

        

        // clientSecret && (
        //   <Elements options={options} stripe={stripeTestPromise}>
        //     <PaymentForm />
        //   </Elements>
        // )
      }
    </>
  )
}
