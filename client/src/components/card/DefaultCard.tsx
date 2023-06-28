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
    <div id={`${_id}`} className="min-w-[258px]">
      <div>
        <Link
          to={`/product/${_id}`}
          className="blok group gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt=""
              className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
            />

            <div className="relative w-full bg-white pt-3">
              <h3 className="mt-4 text-lg text-gray-700 group-hover:underline group-hover:underline-offset-4">
                {titleShortened}
              </h3>

              <p className="mt-2">
                <span className="sr-only"> Regular Price </span>

                <span className="tracking-wider text-gray-900">€{price}</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
DefaultCard.defaultProps = defaultProps;
export default DefaultCard;
