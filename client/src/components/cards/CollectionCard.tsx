import { Link, useNavigate } from 'react-router-dom';
import MainPageHeading from '@pages/home/MainPageHeading';
import { buttonVariants } from '@components/UI/button';

type CollectionCardTypes = {
  backcolor: 'white' | 'pageBackground';
  collectionData: { title: string; description: string };
  lastItem: boolean;
};
function CollectionCard({
  backcolor,
  collectionData,
  lastItem,
}: CollectionCardTypes) {
  const colorStyle = () => {
    switch (backcolor) {
      case 'white':
        return 'text-foreground bg-background';
      case 'pageBackground':
        return 'text-background bg-pageBackground';
      default:
        return '';
    }
  };

  return (
    <div
      className={`${colorStyle()} w-full ${!lastItem && 'pb-12'} text-center`}
    >
      <MainPageHeading
        color={backcolor === 'white' ? 'foreground' : 'background'}
        usecase="sub"
        mainTitle="Award winning books"
        subTitle="Our most awarded books, interested? Check out our gallery."
      />
      <div className="pb-16">{collectionData.title}</div>
      <div>
        <Link
          to="/collections"
          className={buttonVariants({ variant: 'default' })}
        >
          Check out
        </Link>
      </div>
    </div>
  );
}

export default CollectionCard;
