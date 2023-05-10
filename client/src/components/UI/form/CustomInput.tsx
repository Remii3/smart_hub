import { ChangeEvent } from 'react';

type CustomInputTypes = {
  labelValue: string;
  optional: boolean;
  name: string;
  type: string;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  hasError: boolean | null;
  errorValue?: string | null;
  inputValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const defaultProps = {
  placeholder: null,
  disabled: false,
  errorValue: null,
  min: null,
  max: null,
};

function CustomInput({
  labelValue,
  optional,
  name,
  type,
  placeholder,
  min,
  max,
  disabled,
  hasError,
  errorValue,
  inputValue,
  onChange,
}: CustomInputTypes) {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e);
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
        {optional && <span>Optional</span>}
      </div>
      <div>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={`${
            hasError &&
            'bg-red-1 00 border-red-600 text-red-600 focus:border-red-600 focus:ring-red-600'
          } w-full rounded-md border-gray-200 shadow-sm sm:text-sm`}
          value={inputValue}
          onChange={(e) => onChangeHandler(e)}
        />
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

CustomInput.defaultProps = defaultProps;
export default CustomInput;
