type LoadingCircleTypes = 'default' | 'destructive';

export default function LoadingCircle({
  type = 'default',
}: {
  type?: LoadingCircleTypes;
}) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <div
        className={`${type === 'default' && 'border-t-primary'} ${
          type === 'destructive' && 'border-t-destructive'
        } mx-auto block h-6 w-6 animate-spin rounded-full border-[3px] border-current text-background`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
