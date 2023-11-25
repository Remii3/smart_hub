type PropsTypes = {
  text: 'shop' | 'collection' | null;
};

export default function ProductPill({ text }: PropsTypes) {
  return (
    <strong
      className={`${
        text === 'shop'
          ? 'border-blue-600 text-blue-600'
          : 'border-pink-600 text-pink-600'
      } rounded-full border bg-gray-100 px-3 py-0.5 text-xs font-medium tracking-wide`}
    >
      {text}
    </strong>
  );
}
