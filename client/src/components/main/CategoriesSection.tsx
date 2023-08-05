import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// import PrimaryBtn from '../UI/Btns/PrimaryBtn';
import MainPageHeading from '../UI/SpecialElements/MainPageHeading';
import CategoryCard from '../card/CategoryCard';
import { ProductCategories } from '../../types/interfaces';
import { buttonVariants } from '../UI/Btns/Button';

export default function CategoriesSection() {
  const [shopList, setShopList] = useState<ProductCategories[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios.get('/category/all').then((res) => {
      setShopList(res.data);
    });
  }, []);

  return (
    <section className="relative flex w-full flex-col items-center gap-12 pb-16">
      <div className="relative -top-4 left-0 w-full bg-pageBackground">
        <MainPageHeading
          color="white"
          usecase="main"
          mainTitle="Reading with us is easy"
          subTitle="Offering a diverse array of book genres to choose from, for
                every occasion"
        />
      </div>
      <div className="w-full">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3">
          {shopList.slice(0, 6).map((cardItem) => (
            <CategoryCard
              key={cardItem._id}
              _id={cardItem._id}
              label={cardItem.label}
              value={cardItem.value}
              description={cardItem.description}
            />
          ))}
        </div>
      </div>
      <div className="w-full text-center">
        <Link
          to="/shop/categories"
          className={buttonVariants({ variant: 'primary' })}
        >
          Show more
        </Link>
        {/* <PrimaryBtn
          usecase="default"
          type="button"
          onClick={() => {
            navigate('/shop/categories');
          }}
        >
          See all genres
        </PrimaryBtn> */}
      </div>
    </section>
  );
}
