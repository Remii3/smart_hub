import BasicProductCollection from '@pages/shop/BasicProductCollection';

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <div className="h-[40vh] w-full overflow-hidden">
        <img
          className="h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1512580770426-cbed71c40e94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2107&q=80"
          alt="banner_img"
        />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 py-10">
        <BasicProductCollection
          category="action"
          title="New collection"
          marketPlace="Shop"
        />
        <BasicProductCollection
          category="adventure"
          title="New title"
          showMore
          subTitle="adsasd asdasd"
          marketPlace="Shop"
        />
        <BasicProductCollection
          category="science"
          title="New series"
          showMore
          subTitle="
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste
              ipsum tenetur dicta vero id sint ad, natus maxime labore deserunt
              dignissimos facere assumenda in accusamus dolor nihil, minima
              neque beatae.
            "
          marketPlace="Shop"
        />
      </div>
    </div>
  );
}
