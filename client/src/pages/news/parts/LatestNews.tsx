import { NewsType } from '@customTypes/interfaces';
import { useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Dialog, DialogContent } from '@components/UI/dialog';
import NewsArticle from '../popup/NewsArticle';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperArrowRight from '@components/swiper/navigation/SwiperArrowRight';
import SwiperArrowLeft from '@components/swiper/navigation/SwiperArrowLeft';
import SwiperDots from '@components/swiper/pagination/SwiperDots';

interface PropsTypes {
  updateLatestNews: () => void;
  latestNewsData: NewsType[];
}

export default function LatestNews({
  latestNewsData,
  updateLatestNews,
}: PropsTypes) {
  const [newsArticleDialogOpened, setNewsArticleDialogOpened] = useState<
    null | string
  >(null);
  return (
    <Swiper
      className="swiper-news"
      navigation={{
        nextEl: `.swiper-latest-news-button-next`,
        prevEl: `.swiper-latest-news-button-prev`,
      }}
      grabCursor
      pagination={{
        clickable: true,
        el: '.swiper-latest-news-pagination',
      }}
      spaceBetween={0}
      autoplay={{ pauseOnMouseEnter: true, delay: 8000 }}
      breakpoints={{
        540: {
          navigation: {
            enabled: false,
          },
        },

        1024: {
          spaceBetween: 100,
          navigation: {
            enabled: true,
          },
        },
      }}
      modules={[Pagination, Navigation, Autoplay]}
    >
      {latestNewsData.length > 0 &&
        latestNewsData.map((item) => (
          <SwiperSlide
            key={item._id}
            id={item._id}
            style={{ height: 'auto' }}
            className="lg:px-24"
          >
            <Dialog
              open={newsArticleDialogOpened == item._id}
              onOpenChange={() => setNewsArticleDialogOpened(null)}
            >
              <button
                type="button"
                onClick={() => setNewsArticleDialogOpened(item._id)}
                aria-label="News article"
                className="w-full"
              >
                <div className="relative flex">
                  <section className="absolute bottom-0 left-0 w-full bg-gray-800/70 lg:static lg:flex lg:basis-1/2 lg:items-center lg:justify-start lg:bg-white">
                    <div className="p-2 text-start">
                      <strong className="line-clamp-1 text-2xl text-white lg:text-foreground">
                        {item.title}
                      </strong>
                      <div className="line-clamp-2 text-gray-200 lg:text-foreground/25">
                        {item.subtitle}
                      </div>
                      <div className="line-clamp-2 text-white lg:text-foreground">
                        {item.shortDescription}
                      </div>
                    </div>
                  </section>
                  <section className="h-[40vh] basis-[100%] lg:basis-1/2">
                    {item.img ? (
                      <img
                        src={item.img.url}
                        className="aspect-auto h-full w-full object-cover object-center lg:rounded-r-md"
                        alt="latest news img"
                      />
                    ) : (
                      <img
                        className="aspect-auto h-full w-full object-cover object-center lg:rounded-r-md"
                        src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                        alt="latest news img placeholder"
                      />
                    )}
                  </section>
                </div>
              </button>
              <DialogContent className="h-full w-full p-7">
                <NewsArticle
                  newsId={item._id}
                  updateNewsList={updateLatestNews}
                  dialogOpenedHandler={setNewsArticleDialogOpened}
                />
              </DialogContent>
            </Dialog>
          </SwiperSlide>
        ))}
      <SwiperArrowRight elId={`swiper-latest-news-button-next`} />
      <SwiperArrowLeft elId={`swiper-latest-news-button-prev`} />
      <SwiperDots elId={`swiper-latest-news-pagination`} />
    </Swiper>
  );
}
