import CollectionCard from '../components/card/CollectionCard';
import Header from '../layout/Header';
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
  const testCollectionArray = [
    { title: 'asd', description: 'zxczxzxc' },
    { title: 'asd', description: 'zxczxzxc' },
    { title: 'asd', description: 'zxczxzxc' },
    { title: 'asd', description: 'zxczxzxc' },
  ];

  return (
    <>
      <Header />
      <div className='perspective-3 bg-pageBackground relative h-screen overflow-y-auto overflow-x-hidden scroll-smooth'>
        <section className='parallax__group relative min-h-screen w-screen'>
          <div className='sky absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center brightness-50'></div>
        </section>
        <div className='parallax_title absolute top-[65%] flex h-screen w-full justify-start md:top-[100%]  '>
          <div className='text-primaryText flex w-full  flex-col sm:items-start'>
            <div className='mb-14 ml-[15%] max-w-xs sm:max-w-none'>
              <h5 className='uppercase lg:text-4xl'>
                Award winning literature
              </h5>
              <h1 className='uppercase text-white sm:text-5xl lg:text-7xl'>
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
          <div className='parallax__group translate-z-0 relative flex min-h-screen w-screen scale-100 flex-col items-center justify-center bg-white'>
            <section className='bg-pageBackground relative -top-1 left-0 flex w-full flex-col items-center'>
              <div className='py-7 text-center md:py-32'>
                <h2 className='mb-5 uppercase text-white'>
                  Reading with us is easy
                </h2>
                <p className='text-gray900 text-sm uppercase lg:text-lg'>
                  Offering a diverse array of book genres to choose from, for
                  every occasion
                </p>
              </div>
              <div className='w-full bg-white py-12'>
                <div className='pb-16'>
                  <div className='mx-auto grid max-w-7xl grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3'>
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
            <section className='relative flex w-full flex-col items-center'>
              <div className='w-full bg-white py-7 text-center md:py-32'>
                <h2 className='text-dark mb-5 uppercase'>
                  Discover your next great read
                </h2>
                <p className='text-dark text-sm uppercase lg:text-lg'>
                  Unleash the power of imagination, explore new worlds and find
                  your next favorite book with us
                </p>
              </div>
              {testCollectionArray.map((collection, id) => (
                <CollectionCard
                  key={id}
                  backcolor={(id + 1) % 2 ? 'pageBackground' : 'white'}
                  collectionData={collection}
                />
              ))}
            </section>
            <section className='bg-pageBackground relative flex w-full flex-col items-center'>
              <div className=''>Section 3</div>
            </section>
            <section className='bg-pageBackground relative flex w-full flex-col items-center'>
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
