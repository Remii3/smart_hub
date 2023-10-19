import '@assets/styles/swiper.css';
import { Suspense, lazy } from 'react';
import LoadingCircle from '@components/Loaders/LoadingCircle';
const MainBanner = lazy(() => import('./MainBanner'));

const CategoriesSection = lazy(() => import('./CategoriesSection'));
const CollectionSection = lazy(() => import('./CollectionSection'));
const IntroductionSection = lazy(() => import('./IntroductionSection'));
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<LoadingCircle />}>
        <MainBanner />
      </Suspense>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background ">
        <Suspense fallback={<LoadingCircle />}>
          <IntroductionSection />
        </Suspense>
        <Suspense fallback={<LoadingCircle />}>
          <CategoriesSection />
        </Suspense>
        <Suspense fallback={<LoadingCircle />}>
          <CollectionSection />
        </Suspense>
      </div>
    </div>
  );
}
