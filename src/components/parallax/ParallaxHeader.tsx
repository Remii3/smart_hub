const ParallaxHeader = () => {
  return (
    <>
      <section className='parallax__group relative w-screen min-h-screen'>
        <div className='absolute top-0 left-0 right-0 bottom-0 sky flex items-center justify-center'></div>
      </section>
      <div className='parallax_title absolute top-0 left-0 w-screen h-screen flex items-center justify-center'>
        <h1 className='text-white text-6xl'>Hello World</h1>
      </div>
    </>
  );
};

export default ParallaxHeader;
