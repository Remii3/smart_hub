import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function SwiperArrowLeft({ elId }: { elId: string }) {
  return (
    <div
      className={`${elId} absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-300/30 p-3 opacity-90 backdrop-blur-sm transition ease-in-out hover:bg-slate-300/40 hover:opacity-100 lg:flex`}
    >
      <ChevronLeftIcon className="w-10 text-primary" />
    </div>
  );
}
