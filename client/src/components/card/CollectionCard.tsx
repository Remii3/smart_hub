import { useNavigate } from 'react-router-dom';
import MainPageHeading from '../UI/MainPageHeading';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';

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
  const navigate = useNavigate();

  const colorStyle = () => {
    switch (backcolor) {
      case 'white':
        return 'text-dark bg-white';
      case 'pageBackground':
        return 'text-white bg-pageBackground';
      default:
        return '';
    }
  };

  return (
    <div
      className={`${colorStyle()} w-full ${!lastItem && 'pb-12'} text-center`}
    >
      <MainPageHeading
        color={backcolor === 'white' ? 'dark' : 'white'}
        usecase="sub"
        mainTitle="Award winning books"
        subTitle="Our most awarded books, interested? Check out our gallery."
      />
      <div className="pb-16">{collectionData.title}</div>
      <div>
        <PrimaryBtn
          type="button"
          usecase="default"
          onClick={() => {
            navigate(`/collections`);
          }}
        >
          Check out
        </PrimaryBtn>
      </div>
    </div>
  );
}

export default CollectionCard;
