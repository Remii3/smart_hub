import '../assets/styles/swiper.css';
import CategoriesSection from '../components/main/CategoriesSection';
import CollectionSection from '../components/main/CollectionSection';
import SpecialAuctionSection from '../components/main/SpecialAuctionSection';
import AllAuctionsSection from '../components/main/AllAuctionsSection';
import MainBanner from '../components/main/MainBanner';

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
