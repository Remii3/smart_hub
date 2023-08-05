/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
import { ButtonHTMLAttributes, FC } from 'react';

import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../../helpers/utils';

const buttonVariants = cva(
  'focus:outline-none focus:ring text-center inline-block font-medium rounded-lg transition duration-200 ease-out',
  {
    variants: {
      variant: {
        default:
          'text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 active:bg-gray-100 shadow-sm',
        primary:
          'bg-primary text-white hover:bg-blue-700 focus-visible:bg-blue-700 active:bg-blue-800 shadow-sm',
        secondary:
          'text-primary bg-white border border-primary hover:bg-blue-600 hover:text-white shadow-sm active:bg-blue-700',
        tertiary:
          'hover:text-blue-500 focus-visible:text-blue-500 active:text-blue-600 text-blue-400 font-normal',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:bg-red-700 active:bg-red-800 shadow-sm',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus-visible:bg-green-700 active:bg-green-800 shadow-sm',
      },
      size: {
        big: 'px-12 py-3',
        default: 'px-5 py-3',
        sm: 'px-4 py-2',
      },
      isDisabled: {
        yes: 'pointer-events-none opacity-70',
        no: '',
      },
      isToggled: {
        yes: 'text-white bg-primary',
        no: '',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
      isDisabled: 'no',
    },
  }
);
interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button: FC<ButtonProps> = ({
  className,
  size,
  variant,
  isDisabled,
  isToggled,
  type,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        buttonVariants({ variant, size, isDisabled, isToggled, className })
      )}
      {...props}
    />
  );
};

export { Button, buttonVariants };
