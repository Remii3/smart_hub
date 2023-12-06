import { Link } from 'react-router-dom';
import { CartProductType } from '@customTypes/interfaces';

export default function CheckoutItem({
  productData,
  inCartQuantity,
  totalPrice,
}: CartProductType) {
  if (!productData) return <div />;
  return (
    <li className="flex items-center gap-4 py-2">
      <Link
        to={`/product/${productData._id}`}
        className="block overflow-hidden"
      >
        {productData.imgs && productData.imgs[0] ? (
          <img
            src={productData.imgs[0].url}
            alt="product_img"
            width={80}
            height={80}
            className="aspect-square rounded-md object-cover"
          />
        ) : (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
            alt="product_img"
            width={80}
            height={80}
            className="aspect-square rounded-md scale-150 object-cover"
          />
        )}
      </Link>
      <div>
        <Link to={`/product/${productData._id}`} className="block">
          <strong className="m-0 text-lg text-foreground">
            {productData.title}
          </strong>
        </Link>

        <span className="text-muted-foreground text-sm">
          <span>{totalPrice}</span>
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-6">
        <span className="text-lg text-muted-foreground">x{inCartQuantity}</span>
      </div>
    </li>
  );
}
