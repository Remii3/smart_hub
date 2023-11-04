import { Link } from 'react-router-dom';
import { CartProductTypes } from '@customTypes/interfaces';

export default function CheckoutItem({
  productData,
  inCartQuantity,
}: CartProductTypes) {
  if (!productData) return <div />;
  return (
    <li className="flex items-center gap-4">
      <Link to={`/product/${productData._id}`}>
        {productData.imgs && productData.imgs[0] ? (
          <img
            src={productData.imgs[0].url}
            alt="product_img"
            className="h-16 w-16 rounded object-cover"
          />
        ) : (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
            alt="product_img"
            className="h-16 w-16 rounded object-cover"
          />
        )}
      </Link>
      <div>
        <Link to={`/product/${productData._id}`}>
          <h3 className="m-0 text-sm text-gray-900">{productData.title}</h3>
        </Link>

        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
          <div>
            <dt className="inline">Price:</dt>
            <dd className="inline">{productData.shop_info.price}€</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-6">
        <span className="text-lg text-gray-500">x{inCartQuantity}</span>
      </div>
    </li>
  );
}
