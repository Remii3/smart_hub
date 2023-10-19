import { Link, useLocation } from 'react-router-dom';
import { ProductCategories } from '@customTypes/interfaces';
import { Card, CardContent, CardFooter, CardHeader } from '@components/UI/card';

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
    <Link id={_id} to={{ pathname: `/search`, search: finalQuery }}>
      <Card className="relative flex h-full cursor-pointer flex-col gap-4 transition-[transform,box-shadow] duration-300 ease-in-out hover:scale-105 hover:shadow-md active:scale-100">
        <CardHeader className="pb-0">
          <h3 className="text-foreground">{label}</h3>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-muted-foreground sm:text-lg lg:text-xl">
            {description}
          </p>
        </CardContent>
        <CardFooter>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute bottom-5 right-5 h-6 w-6 text-muted-foreground"
          >
            <path
              fillRule="evenodd"
              d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default CategoryCard;
