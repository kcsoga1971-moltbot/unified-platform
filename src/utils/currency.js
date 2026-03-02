// Static exchange rates (CNY base)
export const EXCHANGE_RATES = {
  CNY: 1,
  USD: 7.25,
  JPY: 0.048,
  KRW: 0.0053,
  TWD: 0.228
}

export const CURRENCY_FORMATS = {
  CNY: { symbol: '¥', decimals: 2, position: 'before' },
  USD: { symbol: '$', decimals: 2, position: 'before' },
  JPY: { symbol: '¥', decimals: 0, position: 'before' },
  KRW: { symbol: '₩', decimals: 0, position: 'before' },
  TWD: { symbol: 'NT$', decimals: 2, position: 'before' }
}

export function formatCurrency(amount, currency = 'CNY') {
  if (amount === null || amount === undefined) return '-'
  const fmt = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.CNY
  const num = Number(amount)
  const formatted = num.toLocaleString('zh-CN', {
    minimumFractionDigits: fmt.decimals,
    maximumFractionDigits: fmt.decimals
  })
  return `${fmt.symbol}${formatted}`
}

export function convertCurrency(amount, fromCurrency, toCurrency) {
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1
  const toRate = EXCHANGE_RATES[toCurrency] || 1
  const cnyAmount = amount * fromRate
  return cnyAmount / toRate
}

export function toCNY(amount, currency) {
  const rate = EXCHANGE_RATES[currency] || 1
  return amount * rate
}

export function getCurrencySymbol(currency) {
  return CURRENCY_FORMATS[currency]?.symbol || currency
}
