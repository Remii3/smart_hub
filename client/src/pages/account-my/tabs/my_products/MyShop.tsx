import { useContext } from 'react';
import { UserContext } from '@context/UserProvider';
import MyProducts from './MyProducts';

export default function MyShop() {
  const { userData } = useContext(UserContext);
  if (!userData) return <p>Please log in</p>;
  return (
    <div className="space-y-4">
      <h4>My products</h4>
      <section>
        <h5 className="pb-2 text-lg">Latest:</h5>
        <div>
          {userData.author_info.my_products.length > 0 ? (
            <div>
              <MyProducts
                myProducts={userData.author_info.my_products}
                quantity={4}
                unfold={false}
              />
            </div>
          ) : (
            <p>No products added.</p>
          )}
        </div>
      </section>
      <section>
        <h5 className="pb-2 text-lg">All:</h5>
        <div>
          {userData.author_info.my_products.length > 0 ? (
            <div>
              <MyProducts
                myProducts={userData.author_info.my_products}
                quantity={8}
                unfold
              />
            </div>
          ) : (
            <p>No products added.</p>
          )}
        </div>
      </section>
    </div>
  );
}
