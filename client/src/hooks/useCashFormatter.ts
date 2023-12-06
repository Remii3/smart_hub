interface PropsTypes {
  currency?: string;
  number: number;
}

export default function useCashFormatter({ currency, number }: PropsTypes) {
  const USDollarFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ? currency : 'USD',
  });
  return USDollarFormatter.format(number);
}
