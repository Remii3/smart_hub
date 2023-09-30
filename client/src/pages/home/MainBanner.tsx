import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@components/UI/button';
import { Link } from 'react-router-dom';

export default function MainBanner() {
  const imgBg = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    gsap.to(imgBg.current, {
      scrollTrigger: {
        scrub: 1,
      },
      duration: 0.5,
      scale: '1.25',
      ease: 'sine.out',
    });
  }, []);

  return (
    <section className="h-[102vh] w-full">
      <div
        ref={imgBg}
        className="absolute left-0 top-0 h-[110vh] w-full scale-100 bg-mainBanner bg-cover bg-center bg-no-repeat brightness-50"
      />
      <section className="relative top-20 lg:-top-16">
        <div className="mx-auto max-w-screen-xl px-4 py-[20%] sm:py-32 lg:flex lg:h-screen lg:items-center">
          <div
            id="mainPageTitle"
            className="mx-auto max-w-xl text-center lg:max-w-3xl"
          >
            <h1 className=" font-extrabold text-background ">
              Understand User Flow.
              <strong className="font-extrabold text-blue-600 sm:block">
                Increase Conversion.
              </strong>
            </h1>

            <p className="mt-4 text-background sm:text-xl/relaxed">
              Dive into the world of books and unleash your imagination! Browse
              through our vast collection and find your next literary escape.
            </p>
            <div className="mt-8 space-x-4">
              <Link to={{ pathname: 'search' }}>
                <Button variant={'secondary'}>Explore books</Button>
              </Link>
              <Link to={{ pathname: 'search', search: 'special=bestseller' }}>
                <Button variant={'default'}>Best Sellers</Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 m-auto h-14 w-8 translate-y-96">
            <div className="mousey box-content h-9 w-1 rounded-3xl border-2 border-solid border-background px-4 py-3 opacity-75">
              <div className="h-3 w-1 animate-scroll-down rounded-[25%] bg-background" />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
