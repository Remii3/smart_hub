const cashFormatter = ({ currency, number }) => {
  const USDollarFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ? currency : "USD",
  });
  return USDollarFormatter.format(number);
};

module.exports = cashFormatter;
