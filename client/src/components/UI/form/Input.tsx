/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
import { FC, InputHTMLAttributes } from 'react';

import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../helpers/utils';

const inputVariants = cva('mt-1 w-full rounded-md shadow-sm sm:text-sm', {
  variants: {
    variant: {
      default: 'border-gray-200 text-dark ',
    },
    customSize: {
      big: 'px-6 py-3',
      default: 'px-4 py-2',
      sm: 'px-2 py-1',
    },
    isDisabled: {
      yes: 'pointer-events-none opacity-70 shadow-none text-slate-500 bg-slate-50 border-slate-200',
      no: '',
    },
  },

  defaultVariants: {
    variant: 'default',
    customSize: 'default',
    isDisabled: 'no',
  },
});
interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input: FC<InputProps> = ({
  className,
  customSize,
  variant,
  isDisabled,
  type,
  ...props
}) => {
  return (
    <input
      type={type}
      className={cn(
        inputVariants({ variant, customSize, isDisabled, className })
      )}
      {...props}
    />
  );
};

export { Input, inputVariants };
