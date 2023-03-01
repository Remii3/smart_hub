type CategoryCardTypes = {
  title: string;
  description: string;
};

function CategoryCard({ title, description }: CategoryCardTypes) {
  return (
    <div className='relative rounded-lg py-12 px-10 flex flex-col gap-4 bg-gray900 drop-shadow'>
      <h5>{title}</h5>
      <p>{description}</p>
      <i className='absolute'>{/* arrow icon */}</i>
    </div>
  );
}

export default CategoryCard;
