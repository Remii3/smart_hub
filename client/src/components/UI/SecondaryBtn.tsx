type PropsTypes = {
  usecase: 'switch';
  text: string;
  onClick?: () => void;
  customCSS?: string;
};

function SecondaryBtn({ usecase, text, onClick, customCSS }: PropsTypes) {
  const usecaseClass = () => {
    switch (usecase) {
      case 'switch':
        return 'px-3 h-[60px]';
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
      className={`${customCSS} ${usecaseClass()} text-darkTint rounded-lg bg-white transition-[filter,transform] duration-200 ease-out hover:brightness-95 active:scale-95 active:brightness-90`}
      onClick={clickHandler}
    >
      {text}
    </button>
  );
}

export default SecondaryBtn;
