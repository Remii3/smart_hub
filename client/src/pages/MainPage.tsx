import '@assets/styles/swiper.css';
import CategoriesSection from '@features/mainPage/CategoriesSection';
import CollectionSection from '@features/mainPage/CollectionSection';
import MainBanner from '@features/mainPage/MainBanner';
import IntroductionSection from '@features/mainPage/IntroductionSection';

export default function MainPage() {
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
