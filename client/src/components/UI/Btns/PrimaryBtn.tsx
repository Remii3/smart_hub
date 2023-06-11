/* eslint-disable react/button-has-type */
import { ReactNode } from 'react';

type PropsTypes = {
  usecase: 'default' | 'action' | '';
  type: 'button' | 'submit';
  onClick?: (e: any) => void;
  customCSS?: string;
  additionalStyles?: string;
  children: ReactNode;
  disabled?: boolean;
  isLoading?: false;
  size?: string;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
  additionalStyles: '',
  disabled: false,
  isLoading: false,
  size: null,
};

function PrimaryBtn({
  usecase,
  onClick,
  customCSS,
  type,
  additionalStyles,
  children,
  disabled,
  isLoading,
  size,
}: PropsTypes) {
  const clickHandler = (e: any) => {
    if (onClick) {
      onClick(e);
    }
  };
  // bg-[#5469d4]
  const defaultClasses = `block font-medium rounded text-white border shadow-sm transition ease-out focus:ring ${
    size || 'px-5 py-3'
  }`;
  const primaryClasses = 'border-primary bg-primary focus:ring-blue-300';
  switch (usecase) {
    case 'action':
      return (
        <button
          className={`
           text-xs ${defaultClasses} ${primaryClasses}`}
          onClick={(e) => clickHandler(e)}
          type={type}
          disabled={disabled}
        >
          {isLoading && (
            <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner" /> : children}
            </span>
          )}
        </button>
      );
    default:
      return (
        <button
          type={type}
          className={`${customCSS || 'px-12 py-3 text-sm font-medium '} ${
            !disabled && ': hover:bg-blue-700 '
          } ${defaultClasses} ${primaryClasses} `}
          onClick={(e) => clickHandler(e)}
          disabled={disabled}
        >
          {children}
        </button>
      );
  }
}

PrimaryBtn.defaultProps = defaultProps;

export default PrimaryBtn;
