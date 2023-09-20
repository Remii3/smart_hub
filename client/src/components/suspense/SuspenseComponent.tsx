import { Suspense } from 'react';

type SuspensePropsType = {
  fallback: JSX.Element;
  children: React.ReactNode;
};

export default function SuspenseComponent({
  fallback,
  children,
}: SuspensePropsType) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
