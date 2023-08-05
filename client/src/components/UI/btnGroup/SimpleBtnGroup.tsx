import { ReactNode } from 'react';

export default function SimpleBtnGroup({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
      {children}
    </span>
  );
}
