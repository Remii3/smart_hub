import { ReactNode, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@lib/utils';
import LoadingCircle from '@components/Loaders/LoadingCircle';
const containerVariants = cva('', {
  variants: {
    variant: {
      default: 'container relative mx-auto px-4 2xl:px-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  isLoading?: boolean;
}

export default function MainContainer({
  className,
  variant,
  isLoading,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={
        'relative py-6 ' + cn(containerVariants({ variant }), className)
      }
      {...props}
    >
      {isLoading && <LoadingCircle />}
      {children}
    </div>
  );
}
