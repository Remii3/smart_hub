import Footer from '../layouts/Footer';
import Main from '../layouts/Main';
import Nav from '../layouts/Nav';

const MainPage = () => {
  return (
    <div className='perspective-3 relative h-screen overflow-y-auto overflow-x-hidden bg-[#14222f]'>
      <section className='parallax__group relative w-screen min-h-screen'>
        <div className='absolute top-0 left-0 right-0 bottom-0 sky flex items-center justify-center'></div>
      </section>
      <div className='parallax_title absolute top-0 left-0 w-screen h-screen flex items-center justify-center'>
        <h1 className='text-white text-6xl'>Hello World</h1>
      </div>
      <Nav />
      <Main>
        <div className='parallax__group relative w-screen min-h-screen flex flex-col items-center justify-center scale-100 translate-z-0 bg-[#14222F]'>
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
