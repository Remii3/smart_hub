/* eslint-disable react/button-has-type */
import { Link } from 'react-router-dom';

type PropsTypes = {
  usecase: 'default' | 'light';
  type: 'button' | 'submit';
  onClick?: (e: any) => void;
  customCSS?: string;
  children: any;
  disabled?: boolean;
  size?: string;
  asLink?: boolean;
  linkPath?: string;
};

const defaultProps = {
  onClick: () => {},
  customCSS: '',
  disabled: false,
  size: null,
  asLink: false,
  linkPath: '',
};

export default function TertiaryBtn({
  usecase,
  onClick,
  customCSS,
  type,
  children,
  disabled,
  size,
  asLink,
  linkPath,
}: PropsTypes) {
  const clickHandler = (e: any) => {
    if (onClick) {
      onClick(e);
    }
  };

  const defaultClasses = `focus:ring-blue-300 text-center visible-focus:ring-blue-300 inline-block font-medium rounded transition duration-150 ease-out focus:ring ${
    size || 'px-5 py-3'
  }`;

  const colorsClasses = usecase === 'default' ? 'text-primary' : 'text-white';

  const disabledClasses = 'pointer-events-none opacity-70';

  const interactionColor =
    usecase === 'default'
      ? ' hover:text-blue-600 focus:text-blue-600 active:text-blue-700'
      : 'hover:text-slate-300 focus:text-slate-300 active:text-slate-400';

  switch (usecase) {
    case 'light': {
      return asLink ? (
        <Link
          to={linkPath || ''}
          className={`text-sm ${customCSS} ${defaultClasses} ${colorsClasses}  ${
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
    default: {
      return asLink ? (
        <Link
          to={linkPath || ''}
          className={`text-sm ${customCSS} ${defaultClasses} ${colorsClasses}  ${
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
TertiaryBtn.defaultProps = defaultProps;
