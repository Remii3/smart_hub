type PropsTypes = {
  mainTitle: string;
  subTitle?: string;
  usecase: 'main' | 'sub';
  color: 'background' | 'foreground';
};

export default function MainPageHeading({
  mainTitle,
  subTitle,
  usecase,
  color,
}: PropsTypes) {
  return (
    <div
      className={`${
        usecase === 'main' ? 'py-11' : 'py-10'
      } px-4 text-center md:py-32`}
    >
      {usecase === 'main' ? (
        <h2 className={`mb-5 text-6xl uppercase text-${color}`}>{mainTitle}</h2>
      ) : (
        <h3 className={`mb-5  text-5xl text-${color}`}>{mainTitle}</h3>
      )}
      <p
        className={`${
          color === 'foreground'
            ? 'text-foreground/80'
            : 'text-muted-foreground'
        }  uppercase sm:text-lg`}
      >
        {subTitle}
      </p>
    </div>
  );
}
