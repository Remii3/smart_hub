type PropsTypes = {
  usecase: 'big' | 'normal';
  text: string;
  onClick?: () => void;
  customCSS?: string;
};

function PrimaryBtn({ usecase, text, onClick, customCSS }: PropsTypes) {
  const usecaseClass = () => {
    switch (usecase) {
      case 'big':
        return 'sm:px-12 sm:py-5 px-14 py-3 text-2xl';
      case 'normal':
        return 'px-6 py-4 text-lg max-h-[60px]';
      default:
        return '';
    }
  };

  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
    return;
  };

  return (
    <button
      className={`${customCSS} ${usecaseClass()} bg-primary transition-[filter, scale] rounded-lg font-semibold text-white shadow duration-200 ease-out hover:shadow-md hover:brightness-90 active:scale-95 active:brightness-75`}
      onClick={clickHandler}
    >
      {text}
    </button>
  );
}

export default PrimaryBtn;
