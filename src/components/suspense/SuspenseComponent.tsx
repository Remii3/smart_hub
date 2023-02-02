import { Suspense } from 'react';

type SuspensePropsType = {
  fallback: JSX.Element;
  children: React.ReactNode;
};

const SuspenseComponent = ({ fallback, children }: SuspensePropsType) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SuspenseComponent;
