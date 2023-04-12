import { Link } from 'react-router-dom';

type CategoryCardTypes = {
  cat_name: string;
  cat_description: string;
};

function CategoryCard({ cat_name, cat_description }: CategoryCardTypes) {
  const categoryName = cat_name.charAt(0).toUpperCase() + cat_name.slice(1);

  const maxDescLength = 100;
  let trimmedDesc = cat_description.slice(0, maxDescLength);
  trimmedDesc = trimmedDesc.substring(
    0,
    Math.min(trimmedDesc.length, trimmedDesc.lastIndexOf(' '))
  );

  const categoryDescription = `${trimmedDesc}...`;
  return (
    <Link
      to={{ pathname: `/shop`, search: `category=${cat_name}` }}
      className="relative flex cursor-pointer flex-col gap-4 rounded-lg bg-gray900 px-10 py-12 shadow transition-[transform,box-shadow] duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-100"
    >
      <h4 className="text-dark">{categoryName}</h4>
      <p className="text-darkTint sm:text-lg lg:text-xl">
        {categoryDescription}
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
  );
}

export default CategoryCard;
