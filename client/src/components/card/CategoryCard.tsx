type CategoryCardTypes = {
  title: string;
  description: string;
};

function CategoryCard({ title, description }: CategoryCardTypes) {
  return (
    <div className="relative flex cursor-pointer flex-col gap-4 rounded-lg bg-gray900 py-12 px-10 shadow transition-[transform,box-shadow] duration-200 ease-out hover:scale-105 hover:shadow-lg active:scale-100">
      <h3>{title}</h3>
      <p>{description}</p>
      <i className="absolute">{/* arrow icon */}</i>
    </div>
  );
}

export default CategoryCard;
