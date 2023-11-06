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
import { useState, useEffect, useContext, FormEvent } from 'react';
import { UserContext } from '@context/UserProvider';
import { getCookie } from '@lib/utils';
import { CartContext } from '@context/CartProvider';
import { usePostAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/UI/button';

interface PropsTypes {
  readyToShow: {
    linkAuth: boolean;
    payment: boolean;
    address: boolean;
  };
  readyToShowHandler: React.Dispatch<
    React.SetStateAction<{
      linkAuth: boolean;
      payment: boolean;
      address: boolean;
    }>
  >;
}

export default function CheckoutForm({
  readyToShow,
  readyToShowHandler,
}: PropsTypes) {
  const stripe = useStripe();
  const elements = useElements();
  const { userData, fetchUserData } = useContext(UserContext);
  const { fetchCartData, cartState } = useContext(CartContext);
  const navigate = useNavigate();
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
      const currentUserId = userData.data?._id || getCookie('guestToken');
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.ORDER_ONE,
        body: {
          buyerId: currentUserId,
          items: cartState.products,
        },
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_REMOVE,
        body: {
          userId: currentUserId,
          productId: 'all',
        },
      });

      fetchCartData();
      fetchUserData();
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
        options={{
          defaultValues: { email: userData.data ? userData.data.email : email },
        }}
        onReady={() =>
          readyToShowHandler((prevState) => {
            return { ...prevState, linkAuth: true };
          })
        }
      />
      <PaymentElement
        id="payment-element"
        className="mb-6"
        options={paymentElementOptions}
        onReady={() =>
          readyToShowHandler((prevState) => {
            return { ...prevState, payment: true };
          })
        }
      />
      <AddressElement
        options={{
          mode: 'shipping',
          fields: { phone: 'always' },
          blockPoBox: true,
          validation: { phone: { required: 'auto' } },
          display: { name: 'split' },
          defaultValues: {
            phone: userData.data
              ? userData.data.user_info.phone
              : '123 123 123',
            firstName: userData.data
              ? userData.data.user_info.credentials.first_name
              : '',
            lastName: userData.data
              ? userData.data.user_info.credentials.last_name
              : '',
            address: {
              country: userData.data
                ? userData.data.user_info.address.country
                : '',
              city: userData.data ? userData.data.user_info.address.city : '',
              line1: userData.data
                ? userData.data.user_info.address.line1
                : 'Warszawska',
              line2: userData.data ? userData.data.user_info.address.line2 : '',
              postal_code: userData.data
                ? userData.data.user_info.address.postal_code
                : '',
              state: userData.data ? userData.data.user_info.address.state : '',
            },
          },
        }}
        onChange={(event) => {
          if (event.complete) {
            const { name, address, phone } = event.value;
            setBuyerData({ name, address, phone });
          }
        }}
        onReady={() =>
          readyToShowHandler((prevState) => {
            return { ...prevState, address: true };
          })
        }
      />
      {readyToShow && (
        <Button
          type="submit"
          disabled={
            isLoading ||
            !stripe ||
            !elements ||
            (cartState.products && cartState.products.length < 1)
          }
          id="submit"
          style={{ marginTop: '1rem' }}
          variant={'default'}
          size={'lg'}
          className="w-full"
        >
          <span id="button-text">
            {isLoading ? (
              <div
                className="mx-auto block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-primary text-background"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              'Pay now'
            )}
          </span>
        </Button>
      )}

      {message && (
        <div id="payment-message" className="pt-3 text-center text-red-500">
          {message}
        </div>
      )}
    </form>
  );
}
