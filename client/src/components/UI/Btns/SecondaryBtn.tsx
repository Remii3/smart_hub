type PropsTypes = {
  usecase: 'underline' | 'outline';
  type: 'button' | 'submit';
  text: string;
  onClick?: (e: any) => void;
  additionalStyles?: string;
};

const defaultProps = {
  onClick: () => {},
  additionalStyles: '',
};

function SecondaryBtn({
  usecase,
  type,
  text,
  onClick,
  additionalStyles,
}: PropsTypes) {
  const usecaseClass = () => {
    switch (usecase) {
      case 'underline':
        return 'block text-gray-500 underline underline-offset-4 hover:text-gray-600 ';
      case 'outline':
        return 'border';
      default:
        return 'block rounded border border-gray-600 px-5 py-3 text-gray-600 hover:ring-1 hover:ring-gray-400';
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
      className={` 
        ${usecaseClass()} text-sm font-medium shadow-sm transition ease-out focus:ring focus:ring-white ${additionalStyles}`}
      onClick={(e) => clickHandler(e)}
    >
      {text}
    </button>
  );
}
SecondaryBtn.defaultProps = defaultProps;
export default SecondaryBtn;
