/* eslint-disable react/button-has-type */
import { Link } from 'react-router-dom';

type PropsTypes = {
  usecase: 'default' | 'action' | '';
  type: 'button' | 'submit';
  onClick?: (e: any) => void;
  customCSS?: string;
  children: any;
  disabled?: boolean;
  isLoading?: boolean;
  size?: string;
  asLink?: boolean;
  linkPath?: string;
  textSize?: 'text-sm' | 'text-xs' | 'text-md';
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
  disabled: false,
  isLoading: false,
  size: null,
  asLink: false,
  linkPath: '',
  textSize: 'text-sm',
};

export default function PrimaryBtn({
  usecase,
  onClick,
  customCSS,
  type,
  children,
  disabled,
  isLoading,
  size,
  asLink,
  linkPath,
  textSize,
}: PropsTypes) {
  const clickHandler = (e: any) => {
    if (onClick) {
      onClick(e);
    }
  };
  const defaultClasses = `focus:ring-blue-300 visible-focus:ring-blue-300 text-center inline-block font-medium rounded shadow-sm transition duration-150 ease-out focus:ring ${
    size || 'px-5 py-3'
  }`;
  const colorsClasses = 'bg-primary text-white';

  const disabledClasses = 'pointer-events-none opacity-70';
  const interactionColor = 'hover:bg-blue-600 active:bg-blue-700';

  switch (usecase) {
    case 'action':
      return (
        <button
          type={type}
          className={`
           ${textSize} ${customCSS} ${defaultClasses} ${colorsClasses} ${
            disabled ? disabledClasses : interactionColor
          }`}
          onClick={(e) => clickHandler(e)}
          disabled={disabled}
        >
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner" /> : children}
          </span>
        </button>
      );
    default: {
      return asLink ? (
        <Link
          to={linkPath || ''}
          className={`text-sm ${customCSS} ${defaultClasses} ${colorsClasses} ${
            disabled ? disabledClasses : interactionColor
          }`}
        >
          {children}
        </Link>
      ) : (
        <button
          type={type}
          className={`text-sm ${customCSS} ${defaultClasses} ${colorsClasses} ${
            disabled ? disabledClasses : interactionColor
          }`}
          onClick={(e) => clickHandler(e)}
          disabled={disabled}
        >
          {children}
        </button>
      );
    }
  }
}

PrimaryBtn.defaultProps = defaultProps;
