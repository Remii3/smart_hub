export default function SwiperDots({ elId }: { elId: string }) {
  return (
    <div
      className={`${elId} absolute !bottom-5 !left-1/2 z-10 mx-auto !w-auto -translate-x-1/2 rounded-md bg-slate-300/30 px-2 text-center`}
    ></div>
  );
}
