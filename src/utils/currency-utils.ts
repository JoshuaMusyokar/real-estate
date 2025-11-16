export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export const getCurrencySymbol = (currency: string = "USD"): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(0).replace(/[0.,]/g, "");
};
// export function getCurrencySymbol(currency: string): string {
//   const symbols: Record<string, string> = {
//     USD: "$",
//     EUR: "€",
//     GBP: "£",
//     KES: "KSh",
//     INR: "₹",
//     AED: "د.إ",
//     SAR: "﷼",
//     AUD: "$",
//     CAD: "$",
//     JPY: "¥",
//     ZAR: "R",
//   };

//   return symbols[currency] || currency;
// }
