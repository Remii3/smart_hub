import { Link } from 'react-router-dom';
import { Button } from '@components/UI/button';
import { CollectionCardTypes } from '@customTypes/interfaces';
import StarRating from '@features/rating/StarRating';

export default function CollectionCard({
  _id,
  title,
  imgs,
  price,
  rating,
  shortDescription,
}: CollectionCardTypes) {
  return (
    <Link to={`/collection/${_id}`} className="block rounded-md border p-3">
      <h4 className="">{title}</h4>
      <div>{shortDescription}</div>
      <div>{price.value}</div>
      {rating.avgRating > 0 && (
        <div>
          <StarRating rating={rating.avgRating} />
        </div>
      )}
      {imgs && imgs.length > 0 && (
        <div>
          {imgs.map((img) => (
            <img key={img.id} src={img.url} alt="Collecting img" />
          ))}
        </div>
      )}
      <div>
        <Button variant={'default'}>Check out</Button>
      </div>
    </Link>
  );
}
