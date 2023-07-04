import { Link } from 'react-router-dom';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';

type DefaultCardType = {
  _id: string;
  title: string;
  authors?: string[];
  price: number;
  imgs?: string[];
  deadline?: Date | null;
  description?: string;
};
const defaultProps = {
  imgs: [],
  deadline: null,
  authors: [],
  description: '',
};
function DefaultCard({
  _id,
  title,
  authors,
  deadline,
  description,
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

  const addToCart = (e) => {
    e.preventDefault();
    console.log('asd');
  };

  return (
    <div id={`${_id}`} className="h-full w-full ">
      <div>
        <Link
          to={`/product/${_id}`}
          className="inline-block rounded-2xl bg-white p-5 shadow"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="img"
                className="w-full rounded-2xl object-cover"
              />
              <div>
                <h6 className="m-0 pb-1">{titleShortened}</h6>
                <span>
                  {authors?.map((author, id) => (
                    <span key={id} className="mr-3">
                      {author}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <p>{description}</p>
              <div className="flex justify-between gap-3">
                <h4 className="flex items-center">{price}</h4>
                <div>
                  <div className="pb-3">stars</div>
                  <PrimaryBtn
                    type="button"
                    usecase="default"
                    onClick={addToCart}
                  >
                    Add to cart
                  </PrimaryBtn>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
DefaultCard.defaultProps = defaultProps;
export default DefaultCard;
