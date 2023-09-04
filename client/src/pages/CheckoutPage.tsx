import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CheckoutProdList from '../components/checkout/CheckoutProdList';
import { CartTypes, SimpleFetchDataTypes } from '../types/interfaces';
import CheckoutItem from '../components/checkout/CheckoutItem';
import PrimaryBtn from '../components/UI/Btns/PrimaryBtn';

interface ClientSecretTypes extends SimpleFetchDataTypes {
  data: string;
}

const stripePromise = loadStripe(
  'pk_test_51NDZ0zHqBBlAtOOF6rtXRZnKQzED9S9UZJrm895UcBemW77f3NCFJYcjSif7JeQ98nb58R0e1c53IKC36uLd7oTG00OIYjqZcZ'
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<ClientSecretTypes>({
    data: '',
    isLoading: false,
    hasError: null,
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [lastCartState, setLastCartState] = useState<CartTypes>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setClientSecret((prevState) => {
          return { ...prevState, isLoading: true };
        });

        const { data } = await axios.post('/cart/create-payment-intent');
        setClientSecret((prevState) => {
          return { ...prevState, data: data.clientSecret };
        });

        setClientSecret((prevState) => {
          return { ...prevState, isLoading: false };
        });
      } catch (err) {
        setClientSecret((prevState) => {
          return { ...prevState, hasError: 'Cannot initialize payment intent' };
        });
      }
    };
    fetchData();
  }, []);

  const appearance = {
    theme: 'none',
  } as { theme: 'none' };

  const options = {
    clientSecret: clientSecret.data,
    appearance,
  };

  const changeShowThankYouHandler = (lastCartStateData: CartTypes) => {
    setLastCartState(lastCartStateData);
    setShowThankYou((prevState) => !prevState);
  };

  return (
    <div>
      {showThankYou ? (
        <div className="flex flex-col items-center justify-center">
          <h3 className="pb-6 pt-8">Thank you!</h3>
          <p className="py-3">Your order has been submitted.</p>
          <p className="py-3">You&apos;ve bought:</p>
          <div className="py-3">
            {lastCartState &&
              lastCartState.products.map((item) => (
                <CheckoutItem
                  key={item.productData._id}
                  productData={item.productData}
                  inCartQuantity={item.inCartQuantity}
                  productsTotalPrice={item.productsTotalPrice}
                />
              ))}
          </div>
          <p className="py-3">
            Please check your email for further information.
          </p>
          <PrimaryBtn type="button" usecase="default" asLink linkPath="/">
            Return to main page
          </PrimaryBtn>
        </div>
      ) : (
        <section>
          <h1 className="sr-only">Checkout</h1>
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-50 py-12 md:min-h-[632px] md:py-24">
              <div className="mx-auto max-w-lg space-y-8 px-4 lg:px-8">
                <CheckoutProdList />
              </div>
            </div>

            <div className="bg-white py-12 md:py-24">
              <div className="mx-auto max-w-lg px-4 lg:px-8">
                {!clientSecret.data && clientSecret.isLoading && (
                  <p>Loading...</p>
                )}
                {!clientSecret.isLoading && clientSecret.hasError && (
                  <p className="text-red-500">{clientSecret.hasError}</p>
                )}
                {clientSecret.data &&
                  !clientSecret.isLoading &&
                  !clientSecret.hasError && (
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm
                        changeShowThankYouHandler={changeShowThankYouHandler}
                      />
                    </Elements>
                  )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
