import { Link } from 'react-router-dom';

type DefaultCardType = {
  _id: string;
  title: string;
  authors?: string[];
  price: number;
  imgs?: string[];
  deadline?: Date | null;
};
const defaultProps = {
  imgs: [],
  deadline: null,
  authors: [],
};
function DefaultCard({
  _id,
  title,
  authors,
  deadline,
  price,
  imgs,
}: DefaultCardType) {
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
    <div
      id={`${_id}`}
      className="relative m-auto h-full min-h-[250px] w-full min-w-[250px] cursor-pointer rounded-lg shadow transition-[transform,box-shadow] duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-100"
    >
      <Link to={`/product/${_id}`}>
        {imgs && (
          <img
            src={imgs[0]}
            className="m-auto h-full max-h-[390px] min-h-[390px] w-full rounded-md object-fill"
            alt="cover_img"
          />
        )}
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white py-2 pl-4 pr-4 ">
          <div className="flex flex-col gap-1">
            <h5 className="text-lg text-dark">{titleShortened}</h5>
            <div className="flex items-center justify-between ">
              <div>
                <p className="text-gray600 sm:text-base">
                  {authors?.map((author) => (
                    <span key={author}>{author}</span>
                  ))}
                </p>
                <p className="text-gray600 sm:text-base">
                  {deadline?.toISOString().slice(0, 4) || 'Unlimited'}
                </p>
              </div>
              <div>
                <p className="text-darkTint sm:text-lg">${price}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
DefaultCard.defaultProps = defaultProps;
export default DefaultCard;
