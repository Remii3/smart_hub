import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@lib/utils';
const containerVariants = cva('', {
  variants: {
    variant: {
      default: 'container relative mx-auto px-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export default function MainContainer({
  className,
  variant,
  ...props
}: ContainerProps) {
  return (
    <div className={cn(containerVariants({ variant }), className)} {...props} />
  );
}
