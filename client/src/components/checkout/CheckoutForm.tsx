import {
  useStripe,
  useElements,
  LinkAuthenticationElement,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import {
  Layout,
  StripeLinkAuthenticationElementChangeEvent,
} from '@stripe/stripe-js';
import axios from 'axios';
import { useState, useEffect, useContext, FormEvent } from 'react';
import { UserContext } from '../../context/UserProvider';
import getCookie from '../../helpers/getCookie';
import { CartContext } from '../../context/CartProvider';

export default function CheckoutForm({ changeShowThankYouHandler }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const { userData } = useContext(UserContext);
  const { fetchCartData, cartState } = useContext(CartContext);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buyerData, setBuyerData] = useState<{
    name: string;
    address:
      | {
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
        }
      | undefined;
    phone: string | undefined;
  }>({
    name: '',
    address: undefined,
    phone: undefined,
  });

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
      await axios.post('/order/add', {
        buyerId: currentUserId,
        items: cartState.cart?.products,
      });
      await axios.post('/cart/remove-one', {
        userId: currentUserId,
        productId: 'all',
      });

      changeShowThankYouHandler(cartState);

      fetchCartData();
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
      <AddressElement
        options={{
          mode: 'shipping',
          fields: { phone: 'always' },
          blockPoBox: true,
          validation: { phone: { required: 'auto' } },
          display: { name: 'full' },
        }}
        onChange={(event) => {
          if (event.complete) {
            // Extract potentially complete address
            const { name, address, phone } = event.value;
            setBuyerData({ name, address, phone });
          }
        }}
      />
      <button
        type="submit"
        disabled={
          isLoading ||
          !stripe ||
          !elements ||
          (cartState.cart?.products && cartState.cart?.products.length < 1)
        }
        id="submit"
        style={{ marginTop: '1rem' }}
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner" /> : 'Pay now'}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
