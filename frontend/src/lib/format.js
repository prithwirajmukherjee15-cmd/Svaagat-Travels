export const formatINR = (amount, opts = {}) => {
  const val = Number(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: opts.decimals ?? 0,
    minimumFractionDigits: opts.decimals ?? 0,
  }).format(val);
};

export const formatNumber = (n) => new Intl.NumberFormat("en-IN").format(Number(n || 0));
