type PropsTypes = {
  usecase: 'default' | 'proceed' | '';
  type: 'button' | 'submit';
  text: string;
  onClick?: (e: any) => void;
  customCSS?: string;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
};

function PrimaryBtn({ usecase, text, onClick, customCSS, type }: PropsTypes) {
  const usecaseClass = () => {
    switch (usecase) {
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
      type={type === 'button' ? 'button' : 'submit'}
      className={`${
        customCSS ||
        'border-primary bg-primary px-4 py-2 text-white hover:bg-blue-700 focus:ring-blue-300'
      } ${usecaseClass()} rounded-md border shadow-sm transition ease-out focus:ring`}
      onClick={(e) => clickHandler(e)}
    >
      {text}
    </button>
  );
}

PrimaryBtn.defaultProps = defaultProps;

export default PrimaryBtn;
