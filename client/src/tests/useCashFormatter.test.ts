import { render, screen } from '@testing-library/react';
import useCashFormatter from '@hooks/useCashFormatter';
import { describe, expect, it } from 'vitest';
import React from 'react';

// Dummy component that uses the hook
function DummyComponent(props) {
  const formattedCash = useCashFormatter(props);
  return React.createElement('div', null, formattedCash);
}

describe('useCashFormatter', () => {
  it('should format number to USD if no currency is provided', () => {
    render(React.createElement(DummyComponent, { number: 1234.56 }));
    const formattedCash = screen.getByText('$1,234.56');
    expect(formattedCash).toBeInTheDocument();
  });

  it('should format number to provided currency', () => {
    render(
      React.createElement(DummyComponent, { number: 1234.56, currency: 'EUR' })
    );
    const formattedCash = screen.getByText('€1,234.56');
    expect(formattedCash).toBeInTheDocument();
  });
});
