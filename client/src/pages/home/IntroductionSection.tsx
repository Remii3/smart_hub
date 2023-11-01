import { Card } from '@components/UI/card';

export default function IntroductionSection() {
  return (
    <div className="relative flex w-full flex-col items-center">
      <section className="relative -top-4 left-0 w-full bg-gradient-to-b from-[#0D151C] to-pageBackground shadow-2xl">
        <div className="px-4 py-11 text-center md:py-28">
          <h1 className={`uppercase text-white`}>
            Welcome to the Smart
            <span className="font-bold text-blue-600">HUB</span>
          </h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-6 pt-7 sm:grid-cols-2">
        <Card className="h-full p-8 text-lg">
          Dive into the world of imagination and explore our vast collection of
          books from various genres. Find your next unputdownable read, make
          friends with enchanting characters, and discover hidden gems!
        </Card>
        <Card className="h-full p-8 text-lg">
          Order from anywhere at any time with ease. Enjoy great discounts,
          secure payment options, and swift doorstep delivery. Experience a
          hassle-free book shopping journey at our e-commerce store.
        </Card>
      </section>
    </div>
  );
}
