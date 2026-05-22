// ===== CURRENCY MODULE =====
const CACHE_KEY = 'tsl_fx_rates'
const CACHE_TS  = 'tsl_fx_ts'
const CACHE_TTL = 3_600_000 // 1 hour

const FALLBACK = {
  USD: 1, LKR: 305, EUR: 0.92, GBP: 0.79, AUD: 1.53,
  CAD: 1.36, SGD: 1.35, JPY: 149, INR: 83, CHF: 0.89
}

export const SYMBOLS = {
  USD: '$', LKR: 'Rs', EUR: '€', GBP: '£', AUD: 'A$',
  CAD: 'C$', SGD: 'S$', JPY: '¥', INR: '₹', CHF: 'CHF'
}

let rates  = { ...FALLBACK }
let active = localStorage.getItem('tsl_currency') || 'USD'

async function fetchRates() {
  const ts     = parseInt(localStorage.getItem(CACHE_TS) || '0')
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached && Date.now() - ts < CACHE_TTL) {
    try { rates = { ...FALLBACK, ...JSON.parse(cached) } } catch {}
    return
  }
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = await res.json()
    if (data?.result === 'success') {
      rates = { ...FALLBACK, ...data.rates }
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.rates))
      localStorage.setItem(CACHE_TS, String(Date.now()))
    }
  } catch { /* use fallback rates */ }
}

function syncButtons() {
  const sym = SYMBOLS[active] ?? active
  document.querySelectorAll('.currency-btn').forEach(btn => { btn.textContent = sym })
  document.querySelectorAll('.currency-dropdown li').forEach(li => {
    li.classList.toggle('active', li.dataset.value === active)
  })
}

function setupWidget() {
  document.querySelectorAll('.currency-switcher').forEach(switcher => {
    const btn      = switcher.querySelector('.currency-btn')
    const dropdown = switcher.querySelector('.currency-dropdown')
    if (!btn || !dropdown) return

    btn.addEventListener('click', e => {
      e.stopPropagation()
      const isOpen = !dropdown.classList.contains('hidden')
      document.querySelectorAll('.currency-dropdown').forEach(d => d.classList.add('hidden'))
      if (!isOpen) dropdown.classList.remove('hidden')
    })

    dropdown.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        active = li.dataset.value
        localStorage.setItem('tsl_currency', active)
        dropdown.classList.add('hidden')
        syncButtons()
        updateAllPrices()
        document.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: active } }))
      })
    })
  })

  document.addEventListener('click', () => {
    document.querySelectorAll('.currency-dropdown').forEach(d => d.classList.add('hidden'))
  })

  syncButtons()
  document.querySelectorAll('.currency-dropdown').forEach(d => d.classList.add('hidden'))
}

export function getActive()  { return active }
export function getRates()   { return rates  }

export function convert(usdAmount) {
  return usdAmount * (rates[active] ?? 1)
}

export function fromCurrency(amount, currency) {
  const usd = amount / (rates[currency] ?? 1)
  return usd * (rates[active] ?? 1)
}

export function format(convertedAmount) {
  const sym = SYMBOLS[active] ?? active
  const n   = Math.round(convertedAmount)
  if (['LKR', 'JPY', 'INR'].includes(active)) {
    return `${sym} ${n.toLocaleString()}`
  }
  return `${sym}${n.toLocaleString()}`
}

export function updateAllPrices() {
  document.querySelectorAll('[data-base-price]').forEach(el => {
    const base     = parseFloat(el.dataset.basePrice)
    const currency = el.dataset.baseCurrency || 'USD'
    const unit     = el.dataset.priceUnit    || ''
    const converted = fromCurrency(base, currency)
    el.innerHTML = `${format(converted)} <span>${unit}</span>`
  })
}

export async function initCurrency() {
  await fetchRates()
  setupWidget()
  updateAllPrices()
}
