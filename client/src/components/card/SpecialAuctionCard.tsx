import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SecondaryBtn from '../UI/Btns/SecondaryBtn';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';

type SepcialAuctionCardType = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imgs?: string[];
  highBid?: number;
  swipedFlag: boolean;
  deadline: Date | null;
};

const defalutProps = {
  highBid: 0,
  description: '',
  imgs: [],
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
}: SepcialAuctionCardType) {
  const [descHidden, setDescHidden] = useState(true);

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
    <div id={`${_id}`} className="h-full w-full rounded-lg">
      <div className="rounded-2xl bg-white px-3 py-3">
        <div className="flex flex-col xl:flex-row">
          <div className="w-full min-w-[160px] overflow-hidden rounded-md lg:block lg:max-w-xs lg:pr-4">
            {/* <Link to={`auctions/${_id}`}> */}
            {imgs && (
              // <img
              // src={imgs[0]}
              // className="m-auto h-full max-h-[400px] rounded-md object-contain object-top "
              // alt="cover_img"
              // />
              <img
                alt="Les Paul"
                src="https://images.unsplash.com/photo-1456948927036-ad533e53865c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                className="m-auto aspect-square h-full max-h-[400px] w-full rounded-xl object-contain object-cover object-top"
              />
            )}
            {/* </Link> */}
          </div>
          <div className="flex-grow pt-3">
            <h4 className="pb-6 text-dark">{titleShortened}</h4>
            <div className="flex flex-col justify-between pb-3">
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
                    } overflow-hidden pb-3 transition-[max-height,opacity] duration-300 ease-in-out`}
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
              <div className="flex flex-col justify-start gap-2">
                <PrimaryBtn
                  type="button"
                  usecase="default"
                  asLink
                  linkPath={`/product/${_id}`}
                >
                  Enter live auction
                </PrimaryBtn>
                {description && (
                  <SecondaryBtn
                    type="button"
                    usecase="toggle"
                    onClick={showDesc}
                    toggler={!descHidden}
                  >
                    {descHidden ? 'View details' : 'Hide details'}
                  </SecondaryBtn>
                )}
              </div>
            </div>
            {/* <p
              className={`${
                descHidden ? 'max-h-0 opacity-0' : 'max-h-72 opacity-100'
              } hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out sm:text-lg lg:block`}
            >
              <span className="text-gray600">Description: </span>
              <span className="break-words text-darkTint">{description}</span>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

SpecialAuctionCard.defaultProps = defalutProps;

export default SpecialAuctionCard;
