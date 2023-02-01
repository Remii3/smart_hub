import Main from '../layouts/Main';
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax';
import Nav from '../layouts/Nav';
import { useRef } from 'react';

const MainPage = () => {
  const parallax = useRef<IParallax>(null!);
  return (
    <div>
      <Main>
        <Parallax ref={parallax} pages={6} className='bg-[#14222F]'>
          <ParallaxLayer
            offset={0}
            speed={0}
            className='flex items-center justify-center bg-red-100 z-0'
          >
            <div className=' relative'>
              <h1>Its a Parallax</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={0}
            sticky={{ start: 0, end: 6 }}
            speed={1}
            factor={0.05}
            className='sticky top-0 left-0'
          >
            <Nav />
          </ParallaxLayer>
          <ParallaxLayer
            offset={1}
            speed={1}
            factor={1}
            className='relative flex items-center justify-center'
            onClick={() => parallax.current.scrollTo(2)}
          >
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]' />
            <div className='relative'>
              <h1 className='text-white'>It's a shop</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={2}
            factor={0.95}
            speed={1}
            className='relative flex items-center justify-center'
          >
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]' />
            <div className='relative'>
              <h1 className='text-white'>Its a gallery</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={3}
            speed={1}
            factor={0.95}
            className='relative flex items-center justify-center'
          >
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]' />
            <div className='relative'>
              <h1 className='text-white'>Its a Auction</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={4}
            speed={1}
            factor={0.95}
            className='relative flex items-center justify-center'
          >
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]' />
            <div className='relative'>
              <h1 className='text-white'>Its a Online books</h1>
            </div>
          </ParallaxLayer>

          <ParallaxLayer
            offset={5}
            speed={1}
            factor={0.9}
            className='relative flex items-center justify-center'
          >
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]' />
            <div className='relative '>
              <h1 className='text-white'>Its a Contact</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={5.9}
            speed={1}
            className='relative flex items-start justify-center bg-[#111D28]'
          >
            <div className='absolute top-0 left-0 h-full w-full' />
            <div className='relative '>
              <h1 className='text-white'>Its a footer</h1>
            </div>
          </ParallaxLayer>
        </Parallax>
      </Main>
    </div>
  );
};

export default MainPage;
