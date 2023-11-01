import { buttonVariants } from '@components/UI/button';
import { Link } from 'react-router-dom';
import { ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax';

export default function MainBanner() {
  return (
    <ParallaxBanner
      style={{
        height: 'calc(100vh + 64px)',
      }}
    >
      <ParallaxBannerLayer speed={-15}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fparallaximg.webp?alt=media&token=e3cddb7a-faed-4228-b335-c42c34d540fa"
          alt="banner img"
          height={800}
          width={1336}
          className="h-[calc(100vh+64px+19vh)]  w-full object-cover object-center brightness-50"
        />
      </ParallaxBannerLayer>
      <ParallaxBannerLayer>
        <div className="relative top-20 lg:-top-16">
          <div className="mx-auto max-w-screen-xl px-4 py-[20%] sm:py-32 lg:flex lg:h-screen lg:items-center">
            <section
              id="mainPageTitle"
              className="mx-auto max-w-xl text-left lg:max-w-3xl"
            >
              <h1 className=" font-extrabold text-background ">
                Understand User Flow.
                <strong className="font-extrabold text-blue-600 sm:block">
                  Increase Conversion.
                </strong>
              </h1>

              <p className="mt-4 text-background sm:text-xl/relaxed">
                Dive into the world of books and unleash your imagination!
                Browse through our vast collection and find your next literary
                escape.
              </p>
              <div className="mt-8 space-x-4">
                <Link
                  to={{ pathname: 'search' }}
                  className={`${buttonVariants({ variant: 'secondary' })}`}
                >
                  Explore books
                </Link>
                <Link
                  to={{ pathname: 'search', search: 'special=bestseller' }}
                  className={`${buttonVariants({ variant: 'default' })}`}
                >
                  Best Sellers
                </Link>
              </div>
            </section>
            <div className="absolute inset-0 m-auto h-14 w-8 translate-y-96">
              <div className="mousey box-content h-9 w-1 rounded-3xl border-2 border-solid border-background px-4 py-3 opacity-75">
                <div className="h-3 w-1 animate-scroll-down rounded-[25%] bg-background" />
              </div>
            </div>
          </div>
        </div>
      </ParallaxBannerLayer>
    </ParallaxBanner>
  );
}
