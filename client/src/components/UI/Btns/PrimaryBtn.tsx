import { ReactNode } from 'react';

type PropsTypes = {
  usecase: 'default' | 'proceed' | '';
  type: 'button' | 'submit';
  onClick?: (e: any) => void;
  customCSS?: string;
  additionalStyles?: string;
  children: ReactNode;
  disabled?: boolean;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
  additionalStyles: '',
  disabled: false,
};

function PrimaryBtn({
  usecase,
  onClick,
  customCSS,
  type,
  additionalStyles,
  children,
  disabled,
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
        'border-primary bg-primary px-12 py-3 text-sm font-medium text-white focus:ring-blue-300'
      } ${
        !disabled && ': hover:bg-blue-700 '
      }  rounded border shadow-sm transition ease-out focus:ring ${additionalStyles} ${usecaseClass()}`}
      onClick={(e) => clickHandler(e)}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

PrimaryBtn.defaultProps = defaultProps;

export default PrimaryBtn;
