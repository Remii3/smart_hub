type PropsTypes = {
  mainTitle: string;
  subTitle: string;
  usecase: 'main' | 'sub';
  color: 'white' | 'dark';
};

function MainPageHeading({ mainTitle, subTitle, usecase, color }: PropsTypes) {
  const mainTitleSize = () => {
    if (usecase === 'main') {
      return <h2 className={`mb-5 uppercase text-${color}`}>{mainTitle}</h2>;
    }
    return <h3 className={`mb-5 text-${color}`}>{mainTitle}</h3>;
  };
  const subTitleColor = () => {
    if (color === 'dark') {
      return 'text-darkTint';
    }
    return 'text-gray900';
  };
  return (
    <div
      className={`${
        usecase === 'main' ? 'py-7' : 'py-6'
      } px-4 text-center md:py-32`}
    >
      {mainTitleSize()}
      <p className={`text-sm uppercase lg:text-lg ${subTitleColor()}`}>
        {subTitle}
      </p>
    </div>
  );
}

export default MainPageHeading;
