import { useState } from 'react';
import PrimaryBtn from '../UI/PrimaryBtn';
import SecondaryBtn from '../UI/SecondaryBtn';

type PropsTypes = {
  title: string;
  description: string;
  expDate: Date;
  highBid?: number;
};

function BestAuctionCard({ title, expDate, description, highBid }: PropsTypes) {
  const [descHidden, setDescHidden] = useState(true);
  const showDesc = () => {
    const swiperEl = document.querySelector('.swiper');
    console.log(swiperEl);
    swiperEl?.setAttribute('autoHeight', 'true');
    console.log(swiperEl);

    setDescHidden(prevState => !prevState);
  };

  return (
    <div className='h-auto rounded-lg p-2 transition-all duration-200 ease-out'>
      <div className='rounded-2xl bg-white px-3 pb-3 pt-6'>
        <div className='flex flex-col lg:flex-row'>
          <div className='hidden lg:block'>
            <img src='#' alt='#' />
          </div>
          <div className='flex-grow'>
            <h3 className='text-dark pb-6'>{title}</h3>
            <div className='flex flex-col justify-between lg:flex-row'>
              <div className='flex basis-1/2 flex-row justify-between pb-10'>
                <div className='flex flex-col gap-3'>
                  <p>
                    <span className='text-gray600'> Highest bid:</span>
                    <span className='text-darkTint'>{highBid}</span>
                  </p>
                  <p>
                    <span className='text-gray600'> Deadline:</span>
                    <span className='text-darkTint'>
                      {expDate.toISOString().slice(0, 10)}
                    </span>
                  </p>
                  <p className={`${descHidden ? 'hidden' : 'block'}`}>
                    <span className='text-gray600'>Description: </span>
                    <span className='text-darkTint break-all'>
                      {description}
                    </span>
                  </p>
                </div>
                <div className='pr-3'>
                  <p className='text-darkTint text-lg'>$12</p>
                </div>
              </div>
              <div className='flex flex-col gap-1 sm:flex-row lg:items-start'>
                <PrimaryBtn text='Enter live auction' usecase='normal' />
                <SecondaryBtn
                  usecase='switch'
                  text={descHidden ? 'View details' : 'Hide details'}
                  onClick={showDesc}
                  customCSS={descHidden ? 'brightness-100' : 'brightness-90'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestAuctionCard;
