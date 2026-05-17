import { initCurrency, convert, format } from './currency.js'
import { initSearch }                    from './search.js'
import { initAdminLogin }                from './admin-login.js'
initCurrency()
initSearch()
initAdminLogin()
document.addEventListener('currencyChanged', () => {
  updateLivePrice()
  updateHotelPrice()
  if (lastResults) renderResults(lastResults)
})

// ===== NAVBAR TOGGLE =====
const overlay     = document.querySelector('[data-overlay]')
const navOpenBtn  = document.querySelector('[data-nav-open-btn]')
const navbar      = document.querySelector('[data-navbar]')
const navCloseBtn = document.querySelector('[data-nav-close-btn]')
const navLinks    = document.querySelectorAll('[data-nav-link]')

function toggleNav() {
  navbar?.classList.toggle('active')
  overlay?.classList.toggle('active')
}
navOpenBtn?.addEventListener('click', toggleNav)
navCloseBtn?.addEventListener('click', toggleNav)
overlay?.addEventListener('click', toggleNav)
navLinks.forEach(l => l.addEventListener('click', toggleNav))

// ===== HEADER STICKY + GO-TOP =====
const header   = document.querySelector('[data-header]')
const goTopBtn = document.querySelector('[data-go-top]')
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY >= 200
  header?.classList.toggle('active', scrolled)
  goTopBtn?.classList.toggle('active', scrolled)
})

// ===== DATA =====
const VEHICLE_RATES  = { car: 45, van: 65, tuk: 25, bike: 20 }
const VEHICLE_LABELS = { car: 'Car', van: 'Van', tuk: 'Tuk-Tuk', bike: 'Bike' }
const VEHICLE_ICONS  = { car: 'car-sport-outline', van: 'bus-outline', tuk: 'flash-outline', bike: 'bicycle-outline' }

const HOTEL_RATES  = { guesthouse: 20, '3star': 40, '4star': 80, '5star': 150, none: 0 }
const HOTEL_LABELS = {
  guesthouse: 'Guesthouse / Homestay',
  '3star': '3 Star Hotel',
  '4star': '4 Star Hotel',
  '5star': '5 Star Hotel',
  none: 'No Accommodation'
}
const HOTEL_STARS = {
  guesthouse: '🏠',
  '3star': '★★★',
  '4star': '★★★★',
  '5star': '★★★★★',
  none: '🚗'
}

const PACKAGES = [
  {
    title: 'Cultural Triangle Discovery Tour',
    duration: '7D / 6N', price: 899, maxPeople: 12, region: 'North Central',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/anuradhapura-hm-feat.jpg',
    desc: 'Explore Sigiriya, Polonnaruwa and Anuradhapura — the ancient kingdoms of Sri Lanka — on this immersive journey through centuries of history.',
    tags: ['Colombo','Kandy','Sigiriya','Anuradhapura','Polonnaruwa','Negombo']
  },
  {
    title: 'Beach & Wildlife Safari Adventure',
    duration: '8D / 7N', price: 1199, maxPeople: 10, region: 'South Sri Lanka',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/hikka-hm-feat.jpg',
    desc: "Yala's thrilling leopard safaris by day, whale watching off Mirissa's coast, and relaxing on golden beaches.",
    tags: ['Galle','Hikkaduwa','Mirissa','Tangalle','Yala','Bentota']
  },
  {
    title: 'Hill Country & Tea Estates Escape',
    duration: '5D / 4N', price: 749, maxPeople: 8, region: 'Central Hills',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-2.jpg',
    desc: "Misty mountains, emerald tea plantations, and the world's most scenic train ride from Kandy through Nuwara Eliya to Ella.",
    tags: ['Kandy','Ella','Nuwara Eliya']
  },
  {
    title: 'East Coast Surf & Sun Escape',
    duration: '7D / 6N', price: 990, maxPeople: 10, region: 'East Coast',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/arugambay.jpg',
    desc: 'Ride world-class waves at Arugam Bay, explore pristine Pasikuda beach, and discover the ancient port city of Trincomalee.',
    tags: ['Arugam Bay','Pasikuda','Trincomalee']
  },
  {
    title: 'Jaffna Cultural Immersion',
    duration: '4D / 3N', price: 620, maxPeople: 8, region: 'Northern Province',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-1.jpg',
    desc: "Discover the unique Tamil heritage, ancient Hindu temples, and warm hospitality of Sri Lanka's vibrant north.",
    tags: ['Jaffna']
  },
  {
    title: 'Luxury Yala Safari Lodge Experience',
    duration: '4D / 3N', price: 1850, maxPeople: 6, region: 'South Sri Lanka',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-4.jpg',
    desc: 'Exclusive safari lodge stay inside Yala National Park — encounter leopards, elephants and exotic birds in their natural habitat.',
    tags: ['Yala']
  },
  {
    title: 'Grand Sri Lanka Circuit',
    duration: '14D / 13N', price: 2450, maxPeople: 12, region: 'Island-wide',
    img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-3.jpg',
    desc: 'The ultimate full-island journey — ancient cities, hill country, beaches, wildlife and culture all in one epic adventure.',
    tags: []
  }
]

let lastResults = null

// ===== HELPERS =====
function getRecommended(destination) {
  const matched = PACKAGES.filter(p => p.tags.includes(destination))
  if (matched.length >= 2) return matched.slice(0, 3)
  const grand = PACKAGES.find(p => p.tags.length === 0)
  return [...matched, grand].filter(Boolean).slice(0, 3)
}

function daysBetween(a, b) {
  return Math.max(1, Math.ceil((new Date(b) - new Date(a)) / 86400000))
}

function fmtDate(s) {
  return new Date(s).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function stars() {
  return Array(5).fill('<ion-icon name="star"></ion-icon>').join('')
}

// ===== STEP MACHINE =====
let currentStep = 1
const panels    = document.querySelectorAll('.bk-step-panel')
const stepDots  = document.querySelectorAll('.bk-step')
const stepLines = document.querySelectorAll('.bk-step-line')

function goToStep(n) {
  panels.forEach((p, i) => p.classList.toggle('active', i + 1 === n))
  stepDots.forEach((s, i) => {
    s.classList.toggle('active', i + 1 === n)
    s.classList.toggle('done',   i + 1 < n)
  })
  stepLines.forEach((l, i) => l.classList.toggle('done', i + 1 < n))
  currentStep = n
}

document.getElementById('step1Next')?.addEventListener('click', () => {
  const pickup = document.getElementById('bk-pickup').value
  const dest   = document.getElementById('bk-dest').value
  if (!pickup) { flashInvalid('bk-pickup', 'Please select a pickup location.'); return }
  if (!dest)   { flashInvalid('bk-dest',   'Please select a destination.');     return }
  if (pickup === dest) { alert('Pickup and destination cannot be the same.'); return }
  goToStep(2)
})

document.getElementById('step2Back')?.addEventListener('click', () => goToStep(1))
document.getElementById('step2Next')?.addEventListener('click', () => {
  const checkin  = document.getElementById('bk-checkin').value
  const checkout = document.getElementById('bk-checkout').value
  if (!checkin)  { flashInvalid('bk-checkin',  'Please choose a check-in date.');  return }
  if (!checkout) { flashInvalid('bk-checkout', 'Please choose a check-out date.'); return }
  if (new Date(checkout) <= new Date(checkin)) {
    alert('Check-out must be after check-in.')
    return
  }
  goToStep(3)
})

document.getElementById('step3Back')?.addEventListener('click', () => goToStep(2))
document.getElementById('step3Next')?.addEventListener('click', () => {
  const vehicleEl = document.querySelector('input[name="vehicle"]:checked')
  if (!vehicleEl) { alert('Please select a vehicle type.'); return }
  goToStep(4)
})
document.getElementById('step4Back')?.addEventListener('click', () => goToStep(3))

function flashInvalid(id, msg) {
  const el = document.getElementById(id)
  if (!el) return
  el.style.borderColor = 'hsl(0,70%,55%)'
  el.style.boxShadow  = '0 0 0 3px hsla(0,70%,55%,.15)'
  alert(msg)
  setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = '' }, 2000)
  el.focus()
}

// ===== SWAP BUTTON =====
document.getElementById('swapBtn')?.addEventListener('click', () => {
  const pickupEl = document.getElementById('bk-pickup')
  const destEl   = document.getElementById('bk-dest')
  const tmp = pickupEl.value
  pickupEl.value = destEl.value
  destEl.value   = tmp
  updateRoutePreview()
})

// ===== ROUTE PREVIEW =====
function updateRoutePreview() {
  const pickup = document.getElementById('bk-pickup').value
  const dest   = document.getElementById('bk-dest').value
  const preview = document.getElementById('routePreview')
  if (pickup && dest && pickup !== dest) {
    document.getElementById('routeFrom').textContent = pickup
    document.getElementById('routeTo').textContent   = dest
    preview.style.display = 'flex'
  } else {
    preview.style.display = 'none'
  }
}
document.getElementById('bk-pickup')?.addEventListener('change', updateRoutePreview)
document.getElementById('bk-dest')?.addEventListener('change', updateRoutePreview)

// ===== NIGHTS BADGE =====
function updateNights() {
  const checkin  = document.getElementById('bk-checkin').value
  const checkout = document.getElementById('bk-checkout').value
  const badge    = document.getElementById('nightsBadge')
  const count    = document.getElementById('nightsCount')
  if (checkin && checkout && new Date(checkout) > new Date(checkin)) {
    count.textContent  = daysBetween(checkin, checkout)
    badge.style.display = 'flex'
  } else {
    badge.style.display = 'none'
  }
}
document.getElementById('bk-checkin')?.addEventListener('change', updateNights)
document.getElementById('bk-checkout')?.addEventListener('change', updateNights)

// Set min date for checkin to today
const today = new Date().toISOString().split('T')[0]
const checkinEl  = document.getElementById('bk-checkin')
const checkoutEl = document.getElementById('bk-checkout')
if (checkinEl)  checkinEl.min  = today
if (checkoutEl) checkoutEl.min = today
checkinEl?.addEventListener('change', () => {
  if (checkoutEl) checkoutEl.min = checkinEl.value
})

// ===== GUEST COUNTER =====
let guests = 2
const guestCountEl = document.getElementById('guestCount')
const guestInput   = document.getElementById('bk-people')

function setGuests(n) {
  guests = Math.min(20, Math.max(1, n))
  if (guestCountEl) guestCountEl.textContent = guests
  if (guestInput)   guestInput.value = guests
  updateLivePrice()
}

document.getElementById('guestMinus')?.addEventListener('click', () => setGuests(guests - 1))
document.getElementById('guestPlus')?.addEventListener('click',  () => setGuests(guests + 1))

// ===== LIVE PRICE =====
function updateLivePrice() {
  const vehicleEl = document.querySelector('input[name="vehicle"]:checked')
  const checkin   = document.getElementById('bk-checkin').value
  const checkout  = document.getElementById('bk-checkout').value
  const bar       = document.getElementById('livePriceBar')
  if (!vehicleEl || !checkin || !checkout || new Date(checkout) <= new Date(checkin)) {
    if (bar) bar.style.display = 'none'
    return
  }
  const days  = daysBetween(checkin, checkout)
  const rate  = VEHICLE_RATES[vehicleEl.value]
  const total = Math.round(rate * days * 1.1)
  const noteEl  = document.getElementById('livePriceNote')
  const totalEl = document.getElementById('livePriceTotal')
  if (noteEl)  noteEl.textContent  = `${VEHICLE_LABELS[vehicleEl.value]} · ${format(convert(rate))}/day · ${days} day${days > 1 ? 's' : ''}`
  if (totalEl) totalEl.textContent = format(convert(total))
  if (bar) bar.style.display = 'flex'
}

document.querySelectorAll('input[name="vehicle"]').forEach(r =>
  r.addEventListener('change', updateLivePrice)
)

// ===== HOTEL LIVE PRICE =====
function updateHotelPrice() {
  const hotelEl  = document.querySelector('input[name="hotel"]:checked')
  const checkin  = document.getElementById('bk-checkin').value
  const checkout = document.getElementById('bk-checkout').value
  const bar      = document.getElementById('hotelPriceBar')
  if (!hotelEl || !checkin || !checkout || new Date(checkout) <= new Date(checkin)) {
    if (bar) bar.style.display = 'none'
    return
  }
  if (hotelEl.value === 'none') {
    if (bar) bar.style.display = 'none'
    return
  }
  const days       = daysBetween(checkin, checkout)
  const ratePerPax = HOTEL_RATES[hotelEl.value]
  const total      = ratePerPax * days * guests
  const noteEl     = document.getElementById('hotelPriceNote')
  const totalEl    = document.getElementById('hotelPriceTotal')
  if (noteEl)  noteEl.textContent  = `${HOTEL_LABELS[hotelEl.value]} · ${format(convert(ratePerPax))}/person/night · ${days} night${days > 1 ? 's' : ''} · ${guests} guest${guests > 1 ? 's' : ''}`
  if (totalEl) totalEl.textContent = format(convert(total))
  if (bar) bar.style.display = 'flex'
}

document.querySelectorAll('input[name="hotel"]').forEach(r => {
  r.addEventListener('change', () => {
    document.querySelectorAll('.bk-hotel-card').forEach(c => c.classList.remove('selected'))
    r.closest('.bk-hotel-card')?.classList.add('selected')
    updateHotelPrice()
  })
})

// ===== FORM SUBMIT =====
document.getElementById('bookingForm')?.addEventListener('submit', e => {
  e.preventDefault()
  const form      = e.target
  const pickup    = form.pickup.value
  const dest      = form.destination.value
  const checkin   = form.checkin.value
  const checkout  = form.checkout.value
  const people    = form.people.value
  const vehicleEl = form.querySelector('input[name="vehicle"]:checked')
  const hotelEl   = form.querySelector('input[name="hotel"]:checked')

  if (!vehicleEl) { alert('Please select a vehicle type.'); return }
  if (!hotelEl)   { alert('Please select a hotel type.');   return }

  lastResults = { pickup, destination: dest, people, checkin, checkout, vehicle: vehicleEl.value, hotel: hotelEl.value }
  renderResults(lastResults)

  const params = new URLSearchParams({ pickup, destination: dest, people, checkin, checkout, vehicle: vehicleEl.value, hotel: hotelEl.value })
  history.replaceState(null, '', `?${params.toString()}`)
})

// ===== RENDER RESULTS =====
function renderResults({ pickup, destination, people, checkin, checkout, vehicle, hotel = 'none' }) {
  const days        = daysBetween(checkin, checkout)
  const rate        = VEHICLE_RATES[vehicle]
  const transTotal  = Math.round(rate * days * 1.1)
  const hotelRate   = HOTEL_RATES[hotel] || 0
  const hotelTotal  = hotelRate * days * parseInt(people, 10)
  const grandTotal  = transTotal + hotelTotal
  const pkgs        = getRecommended(destination)

  const chips = [
    { icon: 'radio-button-on-outline', text: pickup },
    { icon: 'navigate-outline',        text: '→' },
    { icon: 'location-outline',        text: destination },
    { icon: 'people-outline',          text: `${people} guest${people == 1 ? '' : 's'}` },
    { icon: 'calendar-outline',        text: `${fmtDate(checkin)} → ${fmtDate(checkout)}` },
    { icon: VEHICLE_ICONS[vehicle],    text: VEHICLE_LABELS[vehicle] },
    { icon: 'moon-outline',            text: `${days} night${days === 1 ? '' : 's'}` },
    { icon: 'bed-outline',             text: HOTEL_LABELS[hotel] || 'No Accommodation' }
  ].map(c => `<span class="br-chip"><ion-icon name="${c.icon}"></ion-icon>${c.text}</span>`).join('')

  const pkgCards = pkgs.map(p => `
    <div class="br-pkg-card">
      <div class="br-pkg-img">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="br-pkg-body">
        <div class="br-pkg-meta">
          <span><ion-icon name="time-outline"></ion-icon>${p.duration}</span>
          <span><ion-icon name="people-outline"></ion-icon>Max ${p.maxPeople}</span>
          <span><ion-icon name="location-outline"></ion-icon>${p.region}</span>
        </div>
        <h3 class="br-pkg-title">${p.title}</h3>
        <p class="br-pkg-desc">${p.desc}</p>
        <div class="br-pkg-footer">
          <div class="br-pkg-rating">${stars()}<span>(verified)</span></div>
          <div class="br-pkg-price">
            <p class="br-price-value">${format(convert(p.price))}</p>
            <p class="br-price-note">/per person</p>
          </div>
          <a href="packages.html" class="btn btn-primary">Book Now</a>
        </div>
      </div>
    </div>`).join('')

  const html = `
    <div class="br-header">
      <div>
        <h2 class="br-title">Your Travel Matches</h2>
        <p class="br-subtitle">
          <strong>${pickup}</strong> → <strong>${destination}</strong>
          &nbsp;·&nbsp; ${people} guest${people == 1 ? '' : 's'}
          &nbsp;·&nbsp; ${days} night${days === 1 ? '' : 's'}
        </p>
      </div>
      <button class="br-modify-link" id="modifySearch">
        <ion-icon name="create-outline"></ion-icon> Modify Search
      </button>
    </div>

    <div class="br-chips">${chips}</div>

    <div class="br-estimate-card">
      <div class="br-estimate-rows">
        <div class="br-estimate-row">
          <div class="br-estimate-left">
            <p class="br-estimate-label">Transport Cost</p>
            <p class="br-estimate-note">
              <ion-icon name="${VEHICLE_ICONS[vehicle]}"></ion-icon>
              ${VEHICLE_LABELS[vehicle]} · ${format(convert(rate))}/day · ${days} day${days > 1 ? 's' : ''} + 10% tax
            </p>
          </div>
          <div class="br-estimate-right">
            <p class="br-estimate-total">${format(convert(transTotal))}</p>
          </div>
        </div>
        ${hotel !== 'none' ? `
        <div class="br-estimate-divider"></div>
        <div class="br-estimate-row">
          <div class="br-estimate-left">
            <p class="br-estimate-label">Accommodation Cost</p>
            <p class="br-estimate-note">
              <ion-icon name="bed-outline"></ion-icon>
              ${HOTEL_STARS[hotel]} ${HOTEL_LABELS[hotel]} · ${format(convert(hotelRate))}/person/night · ${days} night${days > 1 ? 's' : ''} · ${people} guest${people == 1 ? '' : 's'}
            </p>
          </div>
          <div class="br-estimate-right">
            <p class="br-estimate-total">${format(convert(hotelTotal))}</p>
          </div>
        </div>
        <div class="br-estimate-divider"></div>
        <div class="br-estimate-row br-estimate-grand">
          <div class="br-estimate-left">
            <p class="br-estimate-label">Estimated Grand Total</p>
            <p class="br-estimate-note">Transport + Accommodation (excl. meals & entrance fees)</p>
          </div>
          <div class="br-estimate-right">
            <p class="br-estimate-total br-grand-total">${format(convert(grandTotal))}</p>
          </div>
        </div>` : `
        <div class="br-estimate-divider"></div>
        <div class="br-estimate-row">
          <div class="br-estimate-left">
            <p class="br-estimate-label">Accommodation</p>
            <p class="br-estimate-note"><ion-icon name="car-outline"></ion-icon> Transport only — own accommodation</p>
          </div>
          <div class="br-estimate-right">
            <p class="br-estimate-total">—</p>
          </div>
        </div>`}
      </div>
    </div>

    <h3 class="br-section-title">Recommended Packages for ${destination}</h3>
    <div class="br-pkg-list">${pkgCards}</div>

    <div class="br-actions">
      <a href="packages.html" class="btn btn-primary">View All Packages</a>
      <a href="index.html#contact" class="btn btn-outline">Enquire Now</a>
    </div>`

  const section = document.getElementById('resultsSection')
  const inner   = document.getElementById('resultsInner')
  inner.innerHTML = html
  section.style.display = 'block'

  // Stagger-animate cards
  setTimeout(() => {
    inner.querySelectorAll('.br-pkg-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 150)
    })
  }, 50)

  section.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Modify search button
  document.getElementById('modifySearch')?.addEventListener('click', () => {
    goToStep(1)
    section.style.display = 'none'
    document.querySelector('.bk-form-section').scrollIntoView({ behavior: 'smooth' })
  })
}

// ===== PREFILL FROM URL PARAMS =====
;(function init() {
  const p = new URLSearchParams(window.location.search)
  const pickup      = p.get('pickup')
  const destination = p.get('destination')
  const people      = p.get('people')
  const checkin     = p.get('checkin')
  const checkout    = p.get('checkout')
  const vehicle     = p.get('vehicle')

  if (pickup)      { const el = document.getElementById('bk-pickup');  if (el) el.value = pickup }
  if (destination) { const el = document.getElementById('bk-dest');    if (el) el.value = destination }
  if (checkin)     { const el = document.getElementById('bk-checkin'); if (el) el.value = checkin }
  if (checkout)    { const el = document.getElementById('bk-checkout');if (el) el.value = checkout }
  if (people)      setGuests(parseInt(people, 10))
  if (vehicle) {
    const r = document.querySelector(`input[name="vehicle"][value="${vehicle}"]`)
    if (r) { r.checked = true; updateLivePrice() }
  }

  updateRoutePreview()
  updateNights()

  const hotel = p.get('hotel')
  if (hotel) {
    const r = document.querySelector(`input[name="hotel"][value="${hotel}"]`)
    if (r) { r.checked = true; r.closest('.bk-hotel-card')?.classList.add('selected'); updateHotelPrice() }
  }

  if (pickup && destination && people && checkin && checkout && vehicle) {
    renderResults({ pickup, destination, people, checkin, checkout, vehicle, hotel: hotel || 'none' })
  }
})()
