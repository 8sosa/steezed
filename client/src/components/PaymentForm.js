import React, { useEffect, useState} from 'react'
import { PaymentElement, useElements, useStripe, LinkAuthenticationElement } from '@stripe/react-stripe-js'
// import axios from 'axios'


export default function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect( () => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'canceled':
          setMessage('Payment canceled');
          break;
        case 'processing':
          setMessage('Payment processing');
          break;
        case 'requires_payment_method':
          setMessage('Payment requires payment method');
          break;
        case 'succeeded':
          setMessage('Payment succeeded');
          break;
        default: 
        setMessage('Something is not quite right');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "/checkout/success"
      }
    })


    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occured.')
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: "tabs"
  };

  return (
    <>
        <form id='payment-form' onSubmit={handleSubmit}>
          <LinkAuthenticationElement
          id='link-authhentication-element'
          />
          <PaymentElement id='Payment-Element' options={paymentElementOptions} />
          <button disabled={isLoading || !stripe || !elements} id='submit'>
            <span id='btn-text'>
              {isLoading ? <div className='spinner' id='spinner'></div> : 'Pay now'}
            </span>
          </button>
          {message && <div id='Payment-message'>{message}</div>}
        </form>
    </>
  )
}

