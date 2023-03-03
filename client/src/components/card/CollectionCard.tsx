import PrimaryBtn from '../UI/PrimaryBtn';

type CollectionCardTypes = {
  backcolor: 'white' | 'pageBackground';
  collectionData: { title: string; description: string };
};
function CollectionCard({ backcolor, collectionData }: CollectionCardTypes) {
  const colorStyle = () => {
    switch (backcolor) {
      case 'white':
        return 'text-dark bg-white';
      case 'pageBackground':
        return 'text-white bg-pageBackground';
    }
  };

  return (
    <div className={`${colorStyle()} pt-6 pb-12 w-full text-center`}>
      <div className='pb-6'>
        <h4>Award winning books</h4>
        <p>Our most awarded books, interested? Check out our gallery.</p>
      </div>
      <div className='pb-12'>{collectionData.title}</div>
      <div>
        <PrimaryBtn usecase='normal' text='Check out' />
      </div>
    </div>
  );
}

export default CollectionCard;
