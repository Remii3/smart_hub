import { Link } from 'react-router-dom';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';
// import { AuctionCardType } from '../../types/types';
import { ProductAuctionCardType } from '../../types/interfaces';

const defaultProps = {
  img: [],
  deadline: null,
  authors: [],
  description: '',
};
function AuctionCard({
  _id,
  title,
  authors,
  description,
  img,
  auctionEndDate,
  currentPrice,
  startingPrice,
}: ProductAuctionCardType) {
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
    <div id={`${_id}`} className="mx-auto h-full w-full max-w-[400px]">
      <div>
        <div className="inline-block rounded-lg bg-white shadow transition duration-200 ease-in-out hover:shadow-md">
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <Link to={`/product/${_id}`}>
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt="img"
                  className=" w-full rounded-t-lg object-cover"
                />
              </Link>
              <div className="px-3">
                <Link to={`/product/${_id}`}>
                  <h6 className="m-0 line-clamp-2 inline-block min-h-[32px] pb-1">
                    {titleShortened}
                  </h6>
                </Link>
                <div className="line-clamp-1 h-[24px]">
                  {authors?.map((author, id) => (
                    <span key={id} className="mr-3">
                      {author.author_info && author.author_info.pseudonim}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 px-3 pb-3">
              <p className="line-clamp-4 min-h-[80px]">{description}</p>
              <div className="flex justify-between gap-3">
                <h4 className="flex items-center">{currentPrice}€</h4>
                <div>
                  <div className="pb-3">stars</div>
                  <PrimaryBtn
                    type="submit"
                    usecase="default"
                    asLink
                    linkPath={`/product/${_id}`}
                  >
                    Show more
                  </PrimaryBtn>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
AuctionCard.defaultProps = defaultProps;
export default AuctionCard;
