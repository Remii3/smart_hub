/* eslint-disable react/function-component-definition */
import React, { ReactNode } from 'react';

interface DefaultProps {
  children: ReactNode;
  isLoading: boolean;
}

export default function LoadingCircle({ children, isLoading }: DefaultProps) {
  return (
    <span id="button-text">
      {isLoading ? <div className="spinner" id="spinner" /> : children}
    </span>
  );
}
