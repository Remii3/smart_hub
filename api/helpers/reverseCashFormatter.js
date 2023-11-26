const reverseCashFormatter = ({ number }) => {
  const exp = /^\w{0,3}\W?\s?(\d+)[.,](\d+)?,?(\d+)?$/g;
  const replacer = (f, group1, group2, group3) => {
    return group3 ? `${group1}${group2}.${group3}` : `${group1}.${group2}`;
  };
  return number.replace(exp, replacer);
};

module.exports = reverseCashFormatter;
