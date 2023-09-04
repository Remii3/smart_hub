import { useContext } from 'react';
import { UserContext } from '../../context/UserProvider';
import MyProducts from './MyProducts';

export default function MyShop() {
  const { userData } = useContext(UserContext);

  return (
    <div>
      <div>
        <div className="mb-8">
          <h5 className="pb-2 text-lg">Latest:</h5>
          {userData &&
          userData.role !== 'User' &&
          userData.author_info.my_products.length > 0 ? (
            <div>
              <MyProducts
                myProducts={userData.author_info.my_products}
                quantity={4}
                unfold={false}
              />
            </div>
          ) : (
            'No products added.'
          )}
        </div>

        <h5 className="pb-2 text-lg">All:</h5>
        {userData &&
        userData.role !== 'User' &&
        userData.author_info.my_products.length > 0 ? (
          <div>
            <MyProducts
              myProducts={userData.author_info.my_products}
              quantity={8}
              unfold
            />
          </div>
        ) : (
          'No products added.'
        )}
      </div>
    </div>
  );
}
