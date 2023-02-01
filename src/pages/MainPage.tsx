import Footer from '../layouts/Footer';
import Main from '../layouts/Main';
import Nav from '../layouts/Nav';

const MainPage = () => {
  return (
    <div className='perspective-3 h-screen overflow-y-auto overflow-x-hidden bg-[#14222f]'>
      <div className='parallax__group relative w-screen min-h-screen'>
        <div className='absolute top-0 left-0 right-0 bottom-0 sky' />
      </div>
      <Nav />
      <Main>
        <div className='parallax__group relative w-screen min-h-screen flex flex-col items-center justify-center scale-100 translate-z-0 bg-[#14222F]'>
          <div className='relative h-screen w-screen mb-[100vh]'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>{' '}
            Test1
          </div>
          <div className='relative h-screen w-screen mb-[100vh]'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>{' '}
            Test2
          </div>
          <div className='relative h-screen w-screen mb-[100vh]'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>{' '}
            test3
          </div>
          <div className='relative h-screen w-screen mb-[100vh]'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>{' '}
            test4
          </div>
          <div className='relative h-screen w-screen'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>{' '}
            test5
          </div>
        </div>
      </Main>
      <Footer />
    </div>
  );
};

export default MainPage;
