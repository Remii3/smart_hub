import Header from '..//layout/Header';
import CategoryCard from '../components/card/CategoryCard';
import PrimaryBtn from '../components/UI/PrimaryBtn';
import Footer from '../layout/Footer';
import Main from '../layout/Main';

function MainPage() {
  const testArray = [
    { title: 'asd', description: 'zxczxzxc' },
    { title: 'asd', description: 'zxczxzxc' },
    { title: 'asd', description: 'zxczxzxc' },
    { title: 'asd', description: 'zxczxzxc' },
    { title: 'asd', description: 'zxczxzxc' },
    { title: 'asd', description: 'zxczxzxc' },
  ];

  return (
    <>
      <Header />
      <div className='perspective-3 relative h-screen overflow-y-auto overflow-x-hidden bg-[#14222f]'>
        <section className='parallax__group relative w-screen min-h-screen'>
          <div className='absolute top-0 left-0 right-0 bottom-0 sky flex items-center justify-center brightness-50'></div>
        </section>
        <div className='parallax_title absolute top-[65%] md:top-[100%] w-full h-screen flex justify-start  '>
          <div className='w-full flex flex-col  sm:items-start text-primaryText'>
            <div className='mb-14 max-w-xs sm:max-w-none ml-[15%]'>
              <h5 className='uppercase lg:text-4xl'>
                Award winning literature
              </h5>
              <h1 className='text-white uppercase sm:text-5xl lg:text-7xl'>
                <span className='inline-block w-full max-w-[80%]'>
                  Buy best selling
                </span>
                <span className='inline-block w-full max-w-[80%]'>
                  books in the
                </span>
                <span className='inline-block w-full max-w-[80%]'>world</span>
              </h1>
            </div>
            <div className='ml-[15%]'>
              <PrimaryBtn usecase='big' text='See now' />
            </div>
          </div>
        </div>
        <Main>
          {/* Shop */}
          <div className='parallax__group relative w-screen min-h-screen flex flex-col items-center justify-center scale-100 translate-z-0 bg-pageBackground'>
            <section className='relative w-full flex flex-col items-center'>
              <div className='pt-8 pb-7 md:pt-36 md:pb-32 text-center'>
                <h2 className='text-white uppercase mb-5'>
                  Reading with us is easy
                </h2>
                <p className='text-gray900 uppercase text-sm lg:text-lg'>
                  Offering a diverse array of book genres to choose from, for
                  every occasion
                </p>
              </div>
              <div className='py-12 bg-white w-full'>
                <div className='pb-16'>
                  <div className='px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
                    {testArray.map((cardItem, id) => (
                      <CategoryCard
                        key={id}
                        title={cardItem.title}
                        description={cardItem.description}
                      />
                    ))}
                  </div>
                </div>
                <div className='text-center'>
                  <PrimaryBtn usecase='normal' text='See all genres' />
                </div>
              </div>
            </section>
            {/* Special */}
            <section className='relative w-full flex flex-col items-center'>
              <div className='w-full bg-white pt-8 pb-7 md:pt-36 md:pb-32 text-center'>
                <h2 className='text-dark uppercase mb-5'>
                  Discover your next great read
                </h2>
                <p className='text-dark uppercase text-sm lg:text-lg'>
                  Unleash the power of imagination, explore new worlds and find
                  your next favorite book with us
                </p>
              </div>
              <div className='w-full text-center'>
                <div>
                  <h4 className='text-white'>Award winning books</h4>
                  <p className='text-white'>
                    Our most awarded books, interested? Check out our gallery.
                  </p>
                </div>
                <div></div>
                <div>
                  <PrimaryBtn usecase='normal' text='Check out' />
                </div>
              </div>
              <div className='bg-white w-full text-center'>
                <div>
                  <h4 className='text-dark'>Award winning books</h4>
                  <p className='text-dark'>
                    Our most awarded books, interested? Check out our gallery.
                  </p>
                </div>
                <div></div>
                <div>
                  <PrimaryBtn usecase='normal' text='Check out' />
                </div>
              </div>
              <div className='w-full text-center'>
                <div>
                  <h4 className='text-white'>Award winning books</h4>
                  <p className='text-white'>
                    Our most awarded books, interested? Check out our gallery.
                  </p>
                </div>
                <div></div>
                <div>
                  <PrimaryBtn usecase='normal' text='Check out' />
                </div>
              </div>
              <div className='bg-white w-full text-center'>
                <div>
                  <h4 className='text-dark'>Award winning books</h4>
                  <p className='text-dark'>
                    Our most awarded books, interested? Check out our gallery.
                  </p>
                </div>
                <div></div>
                <div>
                  <PrimaryBtn usecase='normal' text='See all' />
                </div>
              </div>
            </section>
            <section className='relative w-full flex flex-col items-center'>
              <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>
              <div className='text-3xl text-white'>Section 3</div>
            </section>
            <section className='relative w-full flex flex-col items-center'>
              <div className='absolute top-0 left-0 h-full w-full bg-[#72FFF4] opacity-[2%]'></div>
              <div className='text-3xl text-white'>Section 4</div>
            </section>
          </div>
        </Main>
        <Footer />
      </div>
    </>
  );
}

export default MainPage;
