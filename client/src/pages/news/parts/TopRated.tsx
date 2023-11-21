import NewsCard from '@components/cards/NewsCard';
import SushiSwiper from '@components/swiper/SushiSwiper';
import { NewsType } from '@customTypes/interfaces';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

interface PropsTypes {
  fetchTopRatedData: () => void;
  newsTopRatedList: NewsType[];
}

export default function TopRated({
  fetchTopRatedData,
  newsTopRatedList,
}: PropsTypes) {
  return (
    <section>
      <div className="block lg:hidden">
        <Swiper
          navigation={{
            nextEl: `.swiper-trendingNews-button-next`,
            prevEl: `.swiper-trendingNews-button-prev`,
          }}
          grabCursor
          spaceBetween={16}
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
          }}
          modules={[Pagination, Navigation]}
          style={{ padding: '4px 4px 56px' }}
        >
          {newsTopRatedList.map((item) => (
            <SwiperSlide key={item._id} style={{ height: 'auto' }} className="">
              <NewsCard
                fetchData={fetchTopRatedData}
                item={item}
                withRating
                thumbnail
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="hidden lg:flex lg:flex-col lg:gap-4">
        {newsTopRatedList.map((item) => (
          <div key={item._id}>
            <NewsCard
              fetchData={fetchTopRatedData}
              item={item}
              withRating
              thumbnail
            />
          </div>
        ))}
      </div>
    </section>
  );
}
