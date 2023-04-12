type PropsTypes = {
  usecase: 'big' | 'normal';
  text: string;
  onClick?: (e: any) => void;
  customCSS?: string;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
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

  const clickHandler = (e: any) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      className={`${customCSS} ${usecaseClass()} whitespace-nowrap rounded-lg bg-primary font-semibold text-white shadow transition-[filter,box-shadow,transform] duration-200 ease-out hover:shadow-lg hover:brightness-90 active:scale-95 active:brightness-75`}
      onClick={(e) => clickHandler(e)}
    >
      {text}
    </button>
  );
}

PrimaryBtn.defaultProps = defaultProps;

export default PrimaryBtn;
