/* eslint-disable react/button-has-type */
import { Link } from 'react-router-dom';

type PropsTypes = {
  usecase: 'default' | 'toggle';
  type: 'button' | 'submit';
  onClick?: (e: any) => void;
  customCSS?: string;
  children: any;
  disabled?: boolean;
  size?: string;
  asLink?: boolean;
  linkPath?: string;
  toggler?: boolean;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
  disabled: false,
  size: null,
  asLink: false,
  linkPath: '',
  toggler: false,
};

export default function SecondaryBtn({
  usecase,
  onClick,
  customCSS,
  type,
  children,
  disabled,
  size,
  asLink,
  linkPath,
  toggler,
}: PropsTypes) {
  const clickHandler = (e: any) => {
    if (onClick) {
      onClick(e);
    }
  };

  const defaultClasses = `focus:ring-blue-300 inline-block text-center font-medium rounded shadow-sm transition duration-150 ease-out focus:ring ${
    size || 'px-5 py-3'
  }`;
  const colorsClasses = `${
    toggler ? 'text-secondary bg-accent' : 'bg-secondary text-primary'
  }`;
  const disabledClasses = 'pointer-events-none opacity-70';
  const interactionColor = 'hover:brightness-[0.9] active:brightness-[0.8]';

  switch (usecase) {
    case 'toggle':
      return (
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
    default: {
      return asLink ? (
        <Link
          to={linkPath || ''}
          className={`text-sm  ${defaultClasses} ${colorsClasses} ${
            disabled ? disabledClasses : interactionColor
          } ${customCSS}`}
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

SecondaryBtn.defaultProps = defaultProps;
