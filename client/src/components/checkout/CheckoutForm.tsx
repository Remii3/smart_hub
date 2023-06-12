import {
  useStripe,
  useElements,
  LinkAuthenticationElement,
  PaymentElement,
} from '@stripe/react-stripe-js';
import {
  Layout,
  StripeLinkAuthenticationElementChangeEvent,
} from '@stripe/stripe-js';
import axios from 'axios';
import { useState, useEffect, useContext, FormEvent } from 'react';
import { UserContext } from '../../context/UserProvider';
import getCookie from '../../helpers/getCookie';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartProvider';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { userData } = useContext(UserContext);
  const { fetchCartData, cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: any) => {
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment succeeded!');
            break;
          case 'processing':
            setMessage('Your payment is processing.');
            break;
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.');
            break;
          default:
            setMessage('Something went wrong.');
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173',
      },
      redirect: 'if_required',
    });
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    } else {
      const currentUserId = userData?._id || getCookie('guestToken');
      await axios.post('/cart/cart-remove', {
        userId: currentUserId,
        productId: 'all',
      });
      fetchCartData();

      navigate('/thankyou');
    }
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  } as { layout: Layout };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e: StripeLinkAuthenticationElementChangeEvent) =>
          setEmail(e.value.email)
        }
        options={{ defaultValues: { email: userData?.email || email } }}
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />

      <button
        type="submit"
        disabled={
          isLoading ||
          !stripe ||
          !elements ||
          (cart?.products && cart?.products.length < 1)
        }
        id="submit"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner" /> : 'Pay now'}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
