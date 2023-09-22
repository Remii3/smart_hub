import '@assets/styles/swiper.css';
import CategoriesSection from './CategoriesSection';
import CollectionSection from './CollectionSection';
import MainBanner from './MainBanner';
import IntroductionSection from './IntroductionSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pageBackground">
      <MainBanner />
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white ">
        <IntroductionSection />
        <CategoriesSection />
        <CollectionSection />
      </div>
    </div>
  );
}
