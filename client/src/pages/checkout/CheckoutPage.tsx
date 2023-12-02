import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect, useCallback } from 'react';
import CheckoutForm from '@pages/checkout/CheckoutForm';
import CheckoutProdList from './CheckoutProdList';
import { FetchDataTypes } from '@customTypes/interfaces';

import { usePostAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import MainContainer from '@layout/MainContainer';
import errorToast from '@components/UI/error/errorToast';
import { Skeleton } from '@components/UI/skeleton';

interface ClientSecretTypes extends FetchDataTypes {
  data: string;
}

const stripePromise = loadStripe(
  'pk_test_51NDZ0zHqBBlAtOOF6rtXRZnKQzED9S9UZJrm895UcBemW77f3NCFJYcjSif7JeQ98nb58R0e1c53IKC36uLd7oTG00OIYjqZcZ'
);

const appearance = {
  theme: 'stripe',
} as { theme: 'flat' | 'stripe' | 'night' };

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<ClientSecretTypes>({
    data: '',
    isLoading: false,
    hasError: null,
  });
  const [readyToShow, setReadyToShow] = useState({
    linkAuth: false,
    payment: false,
    address: false,
  });
  const fetchData = useCallback(async () => {
    setClientSecret((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.CART_PAYMENT_INTENT,
      body: {},
    });
    if (error) {
      setClientSecret((prevState) => {
        return {
          ...prevState,
          isLoading: false,
          hasError: 'Cannot initialize payment intent',
        };
      });
      return errorToast('Cannot initialize payment intent');
    }
    setClientSecret((prevState) => {
      return { ...prevState, data: data.clientSecret, isLoading: false };
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const options = {
    clientSecret: clientSecret.data,
    appearance,
  };
  return (
    <MainContainer>
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-2">
        <div className="bg-gray-50 py-12 md:min-h-[632px] md:py-24">
          <div className="mx-auto max-w-lg space-y-4 px-4 lg:px-8">
            {(!readyToShow.address &&
              !readyToShow.linkAuth &&
              !readyToShow.payment) ||
            clientSecret.isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : (
              <CheckoutProdList />
            )}
          </div>
        </div>

        <div className="bg-background py-12 md:py-24">
          <div className="mx-auto h-full max-w-lg px-4 lg:px-8">
            {!clientSecret.isLoading && clientSecret.hasError && (
              <p className="text-red-500">{clientSecret.hasError}</p>
            )}
            {!clientSecret.isLoading &&
              options.clientSecret &&
              !clientSecret.hasError && (
                <Elements
                  key={options.clientSecret}
                  options={options}
                  stripe={stripePromise}
                >
                  <CheckoutForm
                    readyToShow={readyToShow}
                    readyToShowHandler={setReadyToShow}
                  />
                </Elements>
              )}
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
