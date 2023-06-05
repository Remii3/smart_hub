import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect, useContext } from 'react';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { UserContext } from '../context/UserProvider';
import { CartContext } from '../context/CartProvider';
import CartItem from '../components/cart/CartItem';

const stripePromise = loadStripe(
  'pk_test_51NDZ0zHqBBlAtOOF6rtXRZnKQzED9S9UZJrm895UcBemW77f3NCFJYcjSif7JeQ98nb58R0e1c53IKC36uLd7oTG00OIYjqZcZ'
);

function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const { userData } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  useEffect(() => {
    axios
      .post('/cart/create-payment-intent')
      .then((res) => res.data)
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'none',
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <section>
      <h1 className="sr-only">Checkout</h1>

      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-2">
        <div className="bg-gray-50 py-12 md:min-h-[632px] md:py-24">
          <div className="mx-auto max-w-lg space-y-8 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <span className="h-10 w-10 rounded-full bg-blue-700" />

              <h2 className="font-medium text-gray-900">
                {userData ? userData.credentials.firstName : 'Guest'}
              </h2>
            </div>

            <div>
              <p className="text-2xl font-medium tracking-tight text-gray-900">
                {cart && cart.cartPrice}
              </p>

              <p className="mt-1 text-sm text-gray-600">For the purchase of</p>
            </div>

            <div>
              <div className="flow-root">
                <ul className="-my-4 divide-y divide-gray-100">
                  {cart &&
                    cart.products.map((cartProduct) => (
                      <CartItem
                        key={cartProduct.productData._id}
                        productData={cartProduct.productData}
                        inCartQuantity={cartProduct.inCartQuantity}
                        inCheckout={true}
                      />
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-12 md:py-24">
          <div className="mx-auto max-w-lg px-4 lg:px-8">
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default CheckoutPage;
