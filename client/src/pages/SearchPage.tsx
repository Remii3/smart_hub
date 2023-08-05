import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AdvancedFilter from '../components/search/AdvancedFilter';
import { filterProductsByMarketplace } from '../helpers/filterProducts';
import { UnknownProductTypes } from '../types/interfaces';
import ShopCard from '../components/card/ShopCard';
import AuctionCard from '../components/card/AuctionCard';
import MainContainer from '../components/UI/SpecialElements/MainContainer';

type FinalRawDataTypes = {
  phrase: string;
  category: string;
  author: string;
};

export default function SearchPage() {
  const [selectedMarketplace, setSelectedMarketplace] = useState([
    {
      name: 'shop',
      isChecked: true,
    },
    {
      name: 'auction',
      isChecked: true,
    },
  ]);
  const [products, setProducts] = useState<UnknownProductTypes[]>([]);
  const [searchedData, setSearchedData] = useState<FinalRawDataTypes>({
    author: '',
    category: '',
    phrase: '',
  });

  const searchQuery = useLocation();
  const updatedQuery = searchQuery.search.slice(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/product/searched', { params: { phrase: updatedQuery } })
      .then((res) => {
        setProducts(res.data.products);
        setSearchedData(res.data.finalRawData);
      });
  }, [updatedQuery]);

  const selectMarketplaceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMarketplace((prevState) =>
      prevState.map((el) =>
        el.name === e.target.name ? { ...el, isChecked: !el.isChecked } : el
      )
    );
  };

  let updatedProducts = products;
  if (updatedProducts) {
    updatedProducts = filterProductsByMarketplace({
      selectedMarketplace,
      products,
    });
  }

  const removeQueryHandler = (e: any) => {
    const currentQueryParams = new URLSearchParams(searchQuery.search);
    currentQueryParams.delete(e.currentTarget.name);
    navigate({
      pathname: '/search',
      search: currentQueryParams.toString(),
    });
  };
  return (
    <MainContainer>
      <div className="flex justify-between">
        <p>Results: {updatedProducts && updatedProducts.length}</p>
        <div>Sort</div>
      </div>
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <aside>
          <AdvancedFilter
            selectedMarketplace={selectedMarketplace}
            selectMarketplace={selectMarketplaceHandler}
          />
        </aside>
        <section>
          <ul className="mb-4 grid auto-cols-max grid-flow-col auto-rows-max gap-5">
            {searchedData?.category && (
              <li>
                <button
                  name="category"
                  type="button"
                  onClick={(e) => removeQueryHandler(e)}
                >
                  <span>Category: {searchedData.category}</span>
                  <span>X</span>
                </button>
              </li>
            )}
            {searchedData?.phrase && (
              <li>
                <button
                  name="phrase"
                  type="button"
                  onClick={(e) => removeQueryHandler(e)}
                >
                  <span> Phrase: {searchedData.phrase}</span>
                  <span>X</span>
                </button>
              </li>
            )}
          </ul>
          <div className="grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {updatedProducts && updatedProducts.length > 0 ? (
              updatedProducts.map((item) => {
                return item.market_place === 'Shop' ? (
                  <ShopCard
                    key={item._id}
                    _id={item._id}
                    price={item.shop_info.price}
                    productQuantity={item.quantity}
                    title={item.title}
                    authors={item.authors}
                    description={item.description}
                    img={item.img}
                  />
                ) : (
                  <AuctionCard
                    key={item._id}
                    _id={item._id}
                    title={item.title}
                    authors={item.authors}
                    description={item.description}
                    img={item.img}
                    auctionEndDate={item.auction_info.auction_end_date}
                    currentPrice={item.auction_info.current_price}
                    startingPrice={item.auction_info.starting_price}
                  />
                );
              })
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </section>
      </div>
    </MainContainer>
  );
}
