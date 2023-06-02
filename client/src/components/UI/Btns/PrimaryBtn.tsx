import { ReactNode } from 'react';

type PropsTypes = {
  usecase: 'default' | 'proceed' | '';
  type: 'button' | 'submit';
  onClick?: (e: any) => void;
  customCSS?: string;
  additionalStyles?: string;
  children: ReactNode;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
  additionalStyles: '',
};

function PrimaryBtn({
  usecase,
  onClick,
  customCSS,
  type,
  additionalStyles,
  children,
}: PropsTypes) {
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
        'border-primary bg-primary px-12 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:ring-blue-300'
      }  rounded border shadow-sm transition ease-out focus:ring ${additionalStyles} ${usecaseClass()}`}
      onClick={(e) => clickHandler(e)}
    >
      {children}
    </button>
  );
}

PrimaryBtn.defaultProps = defaultProps;

export default PrimaryBtn;
