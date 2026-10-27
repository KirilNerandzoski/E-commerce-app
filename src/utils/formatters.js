export const EUR_RATE = 61.5;

export const formatPrice = (amountInMKD, currency = "MKD") => {
  if (typeof amountInMKD !== "number" || isNaN(amountInMKD)) {
    return "0 ден.";
  }

  if (currency === "EUR") {
    const inEur = amountInMKD / EUR_RATE;
    return `€ ${inEur.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Default MKD
  return `${amountInMKD.toLocaleString("de-DE")} ден.`;
};

export const getInstallmentPrice = (amountInMKD, months = 24, currency = "MKD") => {
  const perMonth = Math.round(amountInMKD / months);
  return formatPrice(perMonth, currency);
};

export const FREE_SHIPPING_THRESHOLD = 1500;
