export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div>
      <strong className="font-semibold">Error</strong>
      <div>{message}</div>
    </div>
  );
}
