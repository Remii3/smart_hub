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
        return 'px-12 py-6 text-md';
      case 'normal':
        return 'px-6 py-3 text-base';
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
      className={`${customCSS} ${usecaseClass()} font-semiBold rounded-lg border-0 bg-primary text-white transition duration-200 ease-out hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 active:bg-blue-800`}
      onClick={(e) => clickHandler(e)}
    >
      {text}
    </button>
  );
}

PrimaryBtn.defaultProps = defaultProps;

export default PrimaryBtn;
