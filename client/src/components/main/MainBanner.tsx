import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buttonVariants } from '../UI/Btns/Button';

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
          </div>
          <div className="scroll-downs">
            <div className="mousey">
              <div className="scroller" />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
