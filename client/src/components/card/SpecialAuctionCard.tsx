import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';
import SecondaryBtn from '../UI/Btns/SecondaryBtn';
import { ProductTypes } from '../../types/interfaces';

interface PropsTypes extends ProductTypes {
  highBid?: number;
  swipedFlag: boolean;
  deadline: Date | null;
}

const defalutProps = {
  highBid: 0,
};

function SpecialAuctionCard({
  _id,
  title,
  deadline,
  description,
  highBid,
  price,
  imgs,
  swipedFlag,
}: PropsTypes) {
  const [descHidden, setDescHidden] = useState(true);
  const navigate = useNavigate();

  const showDesc = () => {
    setDescHidden((prevState) => !prevState);
  };

  useEffect(() => {
    setDescHidden(true);
  }, [swipedFlag]);

  let titleShortened = title;

  if (title.length >= 50) {
    titleShortened = title.slice(0, 50);
    titleShortened = titleShortened.substring(
      0,
      Math.min(titleShortened.length, titleShortened.lastIndexOf(' '))
    );
    titleShortened = `${titleShortened}...`;
  }

  return (
    <div id={`${_id}`} className="h-auto rounded-lg">
      <div className="rounded-2xl bg-white px-3 py-3">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full min-w-[160px] overflow-hidden rounded-md lg:block lg:max-w-xs lg:pr-4">
            <Link to={`auctions/${_id}`}>
              {imgs && (
                <img
                  src={imgs[0]}
                  className="m-auto h-full max-h-[400px] rounded-md object-contain object-top "
                  alt="cover_img"
                />
              )}
            </Link>
          </div>
          <div className="flex-grow pt-3">
            <h4 className="pb-6 text-dark">{titleShortened}</h4>
            <div className="flex flex-col justify-between pb-3 lg:flex-row">
              <div className="flex flex-row lg:max-w-lg">
                <div className="flex w-full flex-col gap-3">
                  <p className="flex justify-between sm:text-lg">
                    <span className="text-gray600"> Highest bid:</span>
                    <span className="text-darkTint">${highBid}</span>
                  </p>
                  <p className="flex justify-between  sm:text-lg">
                    <span className="text-gray600"> Min bid:</span>
                    <span className="text-darkTint">${price}</span>
                  </p>
                  <p className="flex justify-between sm:text-lg">
                    <span className="text-gray600"> Deadline:</span>
                    <span className="text-darkTint">
                      {deadline?.toISOString().slice(0, 10) || 'Unlimited'}
                    </span>
                  </p>
                  <p
                    className={`${
                      descHidden ? 'max-h-0 opacity-0' : 'max-h-72 opacity-100'
                    } overflow-hidden pb-3 transition-[max-height,opacity] duration-300 ease-in-out lg:hidden`}
                  >
                    <span className="text-base text-gray600">
                      Description:{' '}
                    </span>
                    <span className="text-md break-words text-darkTint">
                      {description}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-start gap-2 sm:flex-row md:flex-col lg:items-start xl:flex-row xl:pt-3">
                <Link
                  type="button"
                  to={`/auctions/${_id}`}
                  className="w-auto rounded border border-primary bg-primary px-5 py-3 text-center text-sm font-medium text-white shadow-sm transition ease-out hover:bg-blue-700 focus:ring focus:ring-blue-300"
                >
                  Enter live auction
                </Link>
                <SecondaryBtn
                  type="button"
                  usecase="outline"
                  text={descHidden ? 'View details' : 'Hide details'}
                  onClick={showDesc}
                  additionalStyles={
                    descHidden ? 'text-gray-600 ' : 'text-white bg-gray-600'
                  }
                />
              </div>
            </div>
            <p
              className={`${
                descHidden ? 'max-h-0 opacity-0' : 'max-h-72 opacity-100'
              } hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out sm:text-lg lg:block`}
            >
              <span className="text-gray600">Description: </span>
              <span className="break-words text-darkTint">{description}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

SpecialAuctionCard.defaultProps = defalutProps;

export default SpecialAuctionCard;
