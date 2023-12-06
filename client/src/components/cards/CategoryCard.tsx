import { Link, useLocation } from 'react-router-dom';
import { ProductCategories } from '@customTypes/interfaces';
import { Card, CardContent, CardFooter, CardHeader } from '@components/UI/card';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';

function CategoryCard({ _id, label, value, description }: ProductCategories) {
  const location = useLocation();

  const existingSearch = new URLSearchParams(location.search);
  let finalQuery = `category=${value}`;

  for (const [key, queryValue] of existingSearch.entries()) {
    if (key !== 'category') {
      finalQuery += `&${key}=${queryValue}`;
    }
  }

  return (
    <Link
      id={_id}
      to={{ pathname: `/search`, search: finalQuery }}
      className="rounded-xl"
    >
      <Card className="relative flex h-full cursor-pointer flex-col gap-4 transition-[transform,box-shadow] duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-100">
        <CardHeader className="pb-0">
          <h3 className="text-foreground">{label}</h3>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 p-1 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </CardContent>
        <CardFooter>
          <ArrowLongRightIcon className="absolute bottom-5 right-5 h-6 w-6 text-muted-foreground" />
        </CardFooter>
      </Card>
    </Link>
  );
}

export default CategoryCard;
