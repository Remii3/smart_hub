import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import type { Engine } from 'tsparticles-engine';

const NoPage404 = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#14222F] font-rubik">
      <div className="error-page flex h-full items-center justify-center text-center">
        <div>
          <h1
            data-h1="404"
            className="relative -mt-4 -ml-1 from-[#71b7e6] via-[#b98acc] to-[#ee8176] 
            p-0
           text-8xl
           font-bold
           after:absolute
           after:top-0 
           after:left-0 
           after:right-0 
           after:animate-animateTextBackground after:bg-gradient-to-r after:bg-[size:400%] after:bg-clip-text
           after:fill-[transparent]
           after:text-transparent
           after:drop-shadow-xl 
           after:content-[attr(data-h1)]
           md:text-9xl
           "
          >
            404
          </h1>
          <p
            data-p="NOT FOUND"
            className="relative max-w-screen-sm text-3xl font-bold uppercase text-[#d6d6d6]
            after:absolute
            after:top-0
            after:left-0
            after:right-0
            after:bg-clip-text
            after:text-transparent
            after:drop-shadow-xl
            after:content-[attr(data-p)] 
            md:max-w-xl
            md:text-4xl"
          >
            Not found
          </p>
        </div>
      </div>
      <div className="particles-js fixed top-0 right-0 bottom-0 left-0"></div>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 5, density: { enable: true, value_area: 800 } },
            color: {
              value: '#ebebeb',
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.2,
                sync: false,
              },
            },
            size: {
              value: 140,
              random: false,
              anim: {
                enable: true,
                speed: 10,
                size_min: 40,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 6,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: false,
              },
              onclick: {
                enable: false,
              },
              resize: true,
            },
          },
          retina_detect: true,
        }}
      />

      <Link
        to={'/'}
        className="fixed right-10 bottom-10 rounded bg-gradient-to-r from-[#71b7e6] via-[#b98acc] to-[#ee8176] py-4 px-7 text-base font-bold uppercase text-white drop-shadow-md transition-all duration-300 ease-out hover:scale-105 hover:drop-shadow-2xl active:opacity-80"
      >
        Go back
      </Link>
    </div>
  );
};

export default NoPage404;
