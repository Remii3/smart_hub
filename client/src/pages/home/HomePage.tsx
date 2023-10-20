import { Suspense, lazy } from 'react';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import IntroductionSection from './IntroductionSection';
import CategoriesSection from './CategoriesSection';
import CollectionSection from './CollectionSection';
import MainBanner from './MainBanner';

export default function HomePage() {
  return (
    <div>
      <MainBanner />
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
