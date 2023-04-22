import React, { ChangeEvent } from 'react';

type InputFieldTypes = {
  name: string;
  type?: string;
  text: string;
  placeholder?: string;
  initiallyDisabled?: boolean;
  initiallyHidden?: boolean;
  error: boolean | null;
  errorMessage: string | null;
  value: string;
  valueChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const defaultProps = {
  type: 'text',
  placeholder: '',
  initiallyDisabled: false,
  initiallyHidden: false,
};

function InputField({
  name,
  type,
  text,
  placeholder,
  initiallyDisabled,
  initiallyHidden,
  error,
  errorMessage,
  value,
  valueChange,
}: InputFieldTypes) {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    valueChange(e);
  };

  return (
    <label
      className={`${initiallyDisabled && 'brightness-90'} 
      ${initiallyHidden ? 'max-h-0 opacity-0 ' : 'max-h-full pb-3 opacity-100'}
      flex flex-col overflow-hidden px-1 text-base transition-[filter,opacity,max-height] duration-300 ease-out`}
    >
      {text}
      <input
        name={name}
        type={type}
        value={value}
        disabled={initiallyDisabled}
        className={`${
          error && 'border-red-600'
        } peer mt-1 w-full rounded-lg bg-gray900 px-4 py-3 shadow transition-[border-color] duration-200 ease-out placeholder:italic placeholder:text-slate-400 `}
        onChange={(e) => onChangeHandler(e)}
        placeholder={placeholder}
      />
      <span
        className={`${
          error && 'max-h-4 opacity-100'
        } max-h-0 pt-1 text-sm text-red-600 opacity-0 transition-[max-height] duration-200 ease-out`}
      >
        {errorMessage || `Invalid ${name}`}
      </span>
    </label>
  );
}

InputField.defaultProps = defaultProps;
export default InputField;
