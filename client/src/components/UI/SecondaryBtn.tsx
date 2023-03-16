type PropsTypes = {
  usecase: 'switch';
  text: string;
  onClick?: () => void;
  customCSS?: string;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
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
  };

  return (
    <button
      type="button"
      className={`${customCSS} ${usecaseClass()} rounded-lg bg-white text-darkTint transition-[filter,transform] duration-200 ease-out hover:brightness-95 active:scale-95 active:brightness-90`}
      onClick={clickHandler}
    >
      {text}
    </button>
  );
}
SecondaryBtn.defaultProps = defaultProps;
export default SecondaryBtn;
