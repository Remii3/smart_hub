import { ChangeEvent, useState } from 'react';

type CustomPasswordInputTypes = {
  labelValue: string;
  optional: boolean;
  name: string;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  hasError: boolean | null;
  errorValue?: string | null;
  inputValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string | undefined;
};

const defaultProps = {
  placeholder: null,
  disabled: false,
  errorValue: null,
  min: null,
  max: null,
  onBlur: undefined,
  autoComplete: undefined,
};

function CustomPasswordInput({
  labelValue,
  optional,
  name,
  placeholder,
  min,
  max,
  disabled,
  hasError,
  errorValue,
  inputValue,
  onChange,
  onBlur,
  autoComplete,
}: CustomPasswordInputTypes) {
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e);
  };

  const showPasswordHandler = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {labelValue}
        </label>
        {optional && <span className="text-sm text-gray-400">Optional</span>}
      </div>
      <div>
        <div className="relative mt-1">
          <input
            autoComplete={autoComplete}
            id={name}
            name={name}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            onBlur={onBlur ? (e) => onBlur(e) : undefined}
            className={`${
              hasError &&
              'bg-red-1 00 border-red-600 text-red-600 focus:border-red-600 focus:ring-red-600'
            } w-full rounded-md border-gray-200 shadow-sm disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none sm:text-sm`}
            value={inputValue}
            onChange={(e) => onChangeHandler(e)}
          />
          {showPassword ? (
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer px-3"
              onClick={showPasswordHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer px-3"
              onClick={showPasswordHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            </button>
          )}
        </div>
        {errorValue && (
          <span
            className={`${
              hasError && 'max-h-4 opacity-100'
            } max-h-0 text-xs text-red-600 opacity-0 transition-[max-height] duration-200 ease-out`}
          >
            {errorValue}
          </span>
        )}
      </div>
    </>
  );
}

CustomPasswordInput.defaultProps = defaultProps;
export default CustomPasswordInput;
