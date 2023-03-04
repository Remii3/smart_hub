import { useState } from 'react';
import PrimaryBtn from '../UI/PrimaryBtn';

type PropsTypes = {
  title: string;
  description: string;
  expDate: Date;
  highBid?: number;
};

function BestAuctionCard({ title, expDate, description, highBid }: PropsTypes) {
  const [descHidden, setDescHidden] = useState(true);
  const showDesc = () => {
    setDescHidden(prevState => !prevState);
  };
  return (
    <div className='rounded-lg p-2'>
      <div className='rounded-2xl bg-white px-2 pb-3 pt-6'>
        <h3 className='text-dark'>{title}</h3>
        <div className='flex'>
          <div>
            <p>Highest bid: {highBid}</p>
            <p>Deadline: {expDate.toISOString()}</p>
            <p className={descHidden ? 'hidden' : 'block'}>
              Description: {description}
            </p>
          </div>
          <div>
            <p>$12</p>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row'>
          <PrimaryBtn text='Enter live auction' usecase='normal' />
          <button onClick={showDesc}>View details</button>
        </div>
      </div>
    </div>
  );
}

export default BestAuctionCard;
