type CategoryCardTypes = {
  title: string;
  description: string;
};

function CategoryCard({ title, description }: CategoryCardTypes) {
  return (
    <div className='bg-gray900 relative flex flex-col gap-4 rounded-lg py-12 px-10 drop-shadow'>
      <h3>{title}</h3>
      <p>{description}</p>
      <i className='absolute'>{/* arrow icon */}</i>
    </div>
  );
}

export default CategoryCard;
