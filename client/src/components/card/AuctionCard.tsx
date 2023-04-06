type PropsTypes = {
  title: string;
  author: string;
  deadline: Date;
  price: number;
};

function AuctionCard({ title, author, deadline, price }: PropsTypes) {
  return (
    <div>
      {/* instead of bg-blue insert img */}
      <div className="relative m-auto h-36 w-auto max-w-[300px] cursor-pointer rounded-lg bg-blue-400 shadow transition-[transform,box-shadow] duration-200 ease-out hover:scale-105 hover:shadow-lg active:scale-100">
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white py-2 pl-4 pr-8 ">
          <div>
            <h5 className="text-dark">{title}</h5>
            <p className="text-gray600 sm:text-lg">{author}</p>
            <p className="text-gray600 sm:text-lg">
              {deadline.toISOString().slice(0, 4)}
            </p>
          </div>
          <div>
            <p className="text-darkTint sm:text-lg">${price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionCard;
