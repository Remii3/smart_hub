type PropsTypes = {
  usecase: 'switch' | 'outline';
  type: 'button' | 'submit';
  text: string;
  onClick?: (e: any) => void;
  customCSS?: string;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
};

function SecondaryBtn({ usecase, type, text, onClick, customCSS }: PropsTypes) {
  const usecaseClass = () => {
    switch (usecase) {
      case 'switch':
        return '';
      case 'outline':
        return 'border';
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
      className={` 
       ${
         customCSS ||
         'border-primary bg-white px-4 py-2 text-primary hover:bg-primary hover:text-white focus:ring-blue-300'
       } ${usecaseClass()} rounded-md shadow-sm transition ease-out focus:ring`}
      onClick={(e) => clickHandler(e)}
    >
      {text}
    </button>
  );
}
SecondaryBtn.defaultProps = defaultProps;
export default SecondaryBtn;
