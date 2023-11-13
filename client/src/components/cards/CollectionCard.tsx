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
  showOnly = false,
}: CollectionCardTypes) {
  return (
    <Link to={`/collection/${_id}`} className="block rounded-md border p-3">
      <h4 className="line-clamp-1">{title}</h4>
      <div className="mb-2 line-clamp-2">{shortDescription}</div>
      {!showOnly && <div>{price.value}</div>}
      {!showOnly && rating.avgRating > 0 && (
        <div>
          <StarRating rating={rating.avgRating} />
        </div>
      )}
      {imgs && imgs.length > 0 && (
        <div
          className={`grid grid-cols-2 ${
            imgs.length > 2 && 'grid-rows-2'
          } px-2`}
        >
          {imgs.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt="Collection_img"
              className="aspect-square"
            />
          ))}
        </div>
      )}
      {!showOnly && (
        <div>
          <Button variant={'default'}>Check out</Button>
        </div>
      )}
    </Link>
  );
}
