import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AdvancedFilter from '../components/search/AdvancedFilter';
import { filterProductsByMarketplace } from '../helpers/filterProducts';
import { ProductTypes } from '../types/interfaces';
import ProductCard from '../components/card/ProductCard';
import AuctionCard from '../components/card/AuctionCard';

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
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [searchedData, setSearchedData] = useState<FinalRawDataTypes>();

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

  const removeQueryhandler = (e: any) => {
    const currentQueryParams = new URLSearchParams(searchQuery.search);
    currentQueryParams.delete(e.currentTarget.name);
    navigate({
      pathname: '/shop/search',
      search: currentQueryParams.toString(),
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex justify-between">
        <p>Results: {updatedProducts && updatedProducts.length}</p>
        <div>Sort</div>
      </div>
      <div className="flex">
        <aside>
          <AdvancedFilter
            selectedMarketplace={selectedMarketplace}
            selectMarketplace={selectMarketplaceHandler}
          />
        </aside>
        <section>
          <ul className="grid auto-cols-max grid-flow-col auto-rows-max gap-5">
            {searchedData?.category && (
              <li>
                <button
                  name="category"
                  type="button"
                  onClick={(e) => removeQueryhandler(e)}
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
                  onClick={(e) => removeQueryhandler(e)}
                >
                  <span> Phrase: {searchedData.phrase}</span>
                  <span>X</span>
                </button>
              </li>
            )}
          </ul>
          <div className="grid grid-flow-row grid-cols-3">
            {updatedProducts && updatedProducts.length > 0 ? (
              updatedProducts.map((item) => {
                return item.marketPlace === 'Shop' ? (
                  <ProductCard
                    key={item._id}
                    _id={item._id}
                    price={item.price}
                    productQuantity={item.quantity}
                    title={item.title}
                    authors={item.authors}
                    description={item.description}
                    imgs={item.imgs}
                  />
                ) : (
                  <AuctionCard
                    key={item._id}
                    _id={item._id}
                    price={item.price}
                    title={item.title}
                    authors={item.authors}
                    description={item.description}
                    imgs={item.imgs}
                  />
                );
              })
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
