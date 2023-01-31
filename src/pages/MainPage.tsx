import Main from '../layouts/Main';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

const MainPage = () => {
  return (
    <div>
      <Main>
        <Parallax pages={4} className='max-h-[350vh]'>
          <ParallaxLayer
            offset={1}
            speed={1}
            className='flex items-center justify-center bg-[#14222F]'
          >
            <div className='h-full w-full  relative'>
              <h1 className='text-white'>Testing! 1</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={1.9}
            speed={1.9}
            className='flex items-center justify-center bg-[#14222F]'
          >
            <div className='h-full w-full  relative'>
              <h1 className='text-white'>Testing! 2</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={3}
            speed={3}
            className='flex items-center justify-center bg-[#14222F]'
          >
            <div className='h-full w-full  relative'>
              <h1 className='text-white'>Auction</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={3.9}
            speed={3.9}
            className='flex items-center justify-center bg-[#14222F]'
          >
            <div className='h-full w-full  relative'>
              <h1 className='text-white'>Footer</h1>
            </div>
          </ParallaxLayer>

          <ParallaxLayer
            offset={0}
            speed={0}
            className='flex items-center justify-center bg-red-100 z-0'
          >
            <div className='h-full w-full  relative'>
              <h1>Hello</h1>
            </div>
          </ParallaxLayer>

          <ParallaxLayer
            offset={2}
            speed={2}
            className='flex items-center justify-center bg-[#14222F]'
          >
            <div className='h-full w-full  relative text-white'>
              <h1 className='text-white'>Its a 2</h1>
            </div>
          </ParallaxLayer>
          <ParallaxLayer
            offset={2.9}
            speed={2.9}
            className='flex items-center justify-center bg-[#14222F]'
          >
            <div className='h-full w-full  relative'>
              <h1 className='text-white'>Its a 2.9</h1>
            </div>
          </ParallaxLayer>
        </Parallax>
      </Main>
    </div>
  );
};

export default MainPage;
