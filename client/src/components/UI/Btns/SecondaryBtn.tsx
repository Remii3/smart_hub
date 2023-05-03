type PropsTypes = {
  usecase: 'switch' | 'outline';
  text: string;
  onClick?: (e: any) => void;
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
      case 'outline':
        return 'border border-primary text-primary';
      default:
        return '';
    }
  };

  const clickHandler = (e: any) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      className={`${customCSS} ${usecaseClass()} rounded-lg bg-white text-darkTint transition-[filter,transform] duration-200 ease-out hover:brightness-95 active:scale-95 active:brightness-90`}
      onClick={(e) => clickHandler(e)}
    >
      {text}
    </button>
  );
}
SecondaryBtn.defaultProps = defaultProps;
export default SecondaryBtn;