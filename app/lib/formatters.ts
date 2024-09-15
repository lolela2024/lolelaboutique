const CURRENCY_FORMATTER = new Intl.NumberFormat("ro-RO", {
  currency: "lei",
  style: "currency",
  minimumFractionDigits: 2, // Setează minimum două zecimale
  maximumFractionDigits: 2, // Setează maximum două zecimale
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat("ro-RO")

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}