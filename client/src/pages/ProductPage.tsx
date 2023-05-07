import MainLayout from '../layout/MainLayout';

function ProductPage() {
  return (
    <MainLayout>
      <div>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-0 py-10 sm:flex-row sm:px-10">
          <section className="sm:basis-1/2 lg:basis-3/4">
            <img src="#" alt="product_img" className="rounded shadow" />
          </section>
          <section className="px-5 sm:basis-1/4 sm:px-0">
            <p>category</p>
            <h3>name</h3>
            <h6>price</h6>
            <button type="button" className="w-full">
              Add to cart
            </button>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductPage;
