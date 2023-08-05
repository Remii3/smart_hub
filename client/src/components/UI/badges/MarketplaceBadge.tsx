import React from 'react';

export default function MarketplaceBadge({
  message,
  color,
  bgColor,
}: {
  message: string;
  color: string;
  bgColor: string;
}) {
  return (
    <span
      className={`whitespace-nowrap rounded-full ${color} px-2.5 py-0.5 text-sm ${bgColor}`}
    >
      {message}
    </span>
  );
}
