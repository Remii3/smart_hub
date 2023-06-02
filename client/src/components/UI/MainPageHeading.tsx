type PropsTypes = {
  mainTitle: string;
  subTitle: string;
  usecase: 'main' | 'sub';
  color: 'white' | 'dark';
};

function MainPageHeading({ mainTitle, subTitle, usecase, color }: PropsTypes) {
  return (
    <div
      className={`${
        usecase === 'main' ? 'py-11' : 'py-10'
      } px-4 text-center md:py-32`}
    >
      {usecase === 'main' ? (
        <h2 className={`mb-5 uppercase text-${color}`}>{mainTitle}</h2>
      ) : (
        <h3 className={`mb-5   text-${color}`}>{mainTitle}</h3>
      )}
      <p
        className={`${
          color === 'dark' ? 'text-darkTint' : 'text-gray900'
        }  uppercase sm:text-lg`}
      >
        {subTitle}
      </p>
    </div>
  );
}

export default MainPageHeading;
