import { Link, useLocation } from 'react-router-dom';
import { ProductCategories } from '../../types/interfaces';

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
    <div id={_id}>
      <Link
        to={{ pathname: `/search`, search: finalQuery }}
        className="relative flex h-full cursor-pointer flex-col gap-4 rounded-lg bg-gray900 px-10 py-12 shadow transition-[transform,box-shadow] duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-100"
      >
        <h4 className="text-dark">{label}</h4>
        <p className="line-clamp-2  text-darkTint sm:text-lg lg:text-xl">
          {description}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute bottom-5 right-5 h-6 w-6 text-gray500"
        >
          <path
            fillRule="evenodd"
            d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  );
}

export default CategoryCard;
