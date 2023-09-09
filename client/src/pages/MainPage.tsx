import '@assets/styles/swiper.css';
import CategoriesSection from '@features/adSections/CategoriesSection';
import CollectionSection from '@features/adSections/CollectionSection';
import SpecialAuctionSection from '@features/adSections/SpecialAuctionSection';
import AllAuctionsSection from '@features/adSections/AllAuctionsSection';
import MainBanner from '@features/adSections/MainBanner';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-pageBackground">
      <MainBanner />
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white ">
        <CategoriesSection />
        <CollectionSection />
        {/* <SpecialAuctionSection /> */}
        {/* <AllAuctionsSection /> */}
      </div>
    </div>
  );
}
