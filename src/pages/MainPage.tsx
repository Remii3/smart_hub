import ParallaxHeader from '../components/parallax/ParallaxHeader';
import Footer from '../layouts/Footer';
import Main from '../layouts/Main';
import Nav from '../layouts/Nav';

const MainPage = () => {
  return (
    <div className='perspective-3 relative h-screen overflow-y-auto overflow-x-hidden bg-[#14222f]'>
      <ParallaxHeader />
      <Main>
        <div className='parallax__group relative w-screen min-h-screen flex flex-col items-center justify-center scale-100 translate-z-0 bg-[#14222F]'>
          <Nav />
          <section className='relative h-screen w-screen mb-[100vh] flex items-center justify-center'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>
            <div className='text-3xl text-white'>Section 1</div>
          </section>
          <section className='relative h-screen w-screen mb-[100vh] flex items-center justify-center'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>
            <div className='text-3xl text-white'>Section 2</div>
          </section>
          <section className='relative h-screen w-screen mb-[100vh] flex items-center justify-center'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>
            <div className='text-3xl text-white'>Section 3</div>
          </section>
          <section className='relative h-screen w-screen mb-[100vh] flex items-center justify-center'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>
            <div className='text-3xl text-white'>Section 4</div>
          </section>
          <section className='relative h-screen w-screen flex items-center justify-center'>
            <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>
            <div className='text-3xl text-white'>Section 5</div>
          </section>
        </div>
      </Main>
      <Footer />
    </div>
  );
};

export default MainPage;
