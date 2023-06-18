import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    <section className="h-screen w-full">
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
            <h1 className=" font-extrabold text-white ">
              Understand User Flow.
              <strong className="font-extrabold text-primary sm:block">
                Increase Conversion.
              </strong>
            </h1>

            <p className="mt-4 text-white sm:text-xl/relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
              illo tenetur fuga ducimus numquam ea!
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="block w-full rounded border border-primary bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm
                  transition ease-out hover:bg-blue-700 focus:ring focus:ring-blue-300 sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                //
                // className="block w-full px-12 py-3 text-sm font-medium text-white underline underline-offset-4  hover:text-primary focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                className="block rounded border border-white px-5 py-3 text-sm text-white transition hover:ring-1 hover:ring-white"
                to="/"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
