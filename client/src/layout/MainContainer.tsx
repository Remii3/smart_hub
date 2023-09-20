import { ReactNode } from 'react';

export default function MainContainer({ children }: { children: ReactNode }) {
  return <div className="container relative mx-auto px-4">{children}</div>;
}
