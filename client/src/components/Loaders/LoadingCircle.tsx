export default function LoadingCircle() {
  return (
    <div
      className="absolute left-1/2 top-1/2 mx-auto block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-primary text-background"
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
