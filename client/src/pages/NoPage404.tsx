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
    <div className='font-rubik h-screen overflow-hidden bg-[#14222F]'>
      <div className='error-page flex items-center justify-center text-center h-full'>
        <div>
          <h1
            data-h1='404'
            className='text-8xl font-bold relative -mt-4 -ml-1 p-0 
            md:text-9xl
           after:content-[attr(data-h1)]
           after:absolute
           after:top-0
           after:left-0 
           after:right-0 
           after:text-transparent 
           after:bg-gradient-to-r from-[#71b7e6] via-[#b98acc] to-[#ee8176]
           after:bg-clip-text
           after:fill-[transparent]
           after:bg-400% 
           after:drop-shadow-xl
           after:animate-animateTextBackground
           '
          >
            404
          </h1>
          <p
            data-p='NOT FOUND'
            className='uppercase text-[#d6d6d6] text-3xl font-bold max-w-screen-sm relative
            md:text-4xl
            md:max-w-xl
            after:content-[attr(data-p)]
            after:absolute
            after:top-0
            after:left-0
            after:right-0
            after:text-transparent 
            after:drop-shadow-xl
            after:bg-clip-text'
          >
            Not found
          </p>
        </div>
      </div>
      <div className='particles-js fixed top-0 right-0 bottom-0 left-0'></div>
      <Particles
        id='tsparticles'
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
        className='uppercase fixed right-10 bottom-10 rounded drop-shadow-md text-white text-base font-bold py-4 px-7 bg-gradient-to-r from-[#71b7e6] via-[#b98acc] to-[#ee8176] hover:drop-shadow-2xl hover:scale-105 transition-all ease-out duration-300 active:opacity-80'
      >
        Go back
      </Link>
    </div>
  );
};

export default NoPage404;
