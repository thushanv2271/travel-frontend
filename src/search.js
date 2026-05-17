// ===== SITE SEARCH =====

const SEARCH_DATA = [
  // Destinations
  { type: 'destination', title: 'Sigiriya',         desc: 'Ancient rock fortress & frescoes',          tags: ['cultural','heritage','history'],   url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/sigiriya.jpg' },
  { type: 'destination', title: 'Kandy',             desc: 'Temple of the Tooth & cultural shows',      tags: ['cultural','temple'],               url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/kandy.jpg' },
  { type: 'destination', title: 'Ella',              desc: 'Nine Arch Bridge & mountain hiking',        tags: ['adventure','nature','hiking'],      url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-2.jpg' },
  { type: 'destination', title: 'Galle',             desc: 'Dutch colonial fort & ocean views',         tags: ['heritage','beach','colonial'],      url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/galle-hm-feat.jpg' },
  { type: 'destination', title: 'Mirissa',           desc: 'Whale watching & golden beaches',           tags: ['beach','whale','wildlife'],         url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/hikka-hm-feat.jpg' },
  { type: 'destination', title: 'Arugam Bay',        desc: 'World-class surfing on the east coast',     tags: ['beach','surf','adventure'],         url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/arugambay.jpg' },
  { type: 'destination', title: 'Nuwara Eliya',      desc: 'Tea plantations & cool hill country',       tags: ['nature','tea','hills'],             url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-2.jpg' },
  { type: 'destination', title: 'Yala',              desc: 'Leopard safaris & wildlife park',           tags: ['wildlife','safari','nature'],       url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-4.jpg' },
  { type: 'destination', title: 'Trincomalee',       desc: 'Pristine beaches & natural harbour',        tags: ['beach','history','east'],           url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-1.jpg' },
  { type: 'destination', title: 'Anuradhapura',      desc: 'Ancient Buddhist kingdom ruins',            tags: ['cultural','heritage','history'],   url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/anuradhapura-hm-feat.jpg' },
  { type: 'destination', title: 'Polonnaruwa',       desc: 'Medieval capital with ancient temples',     tags: ['cultural','heritage','ruins'],      url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-3.jpg' },
  { type: 'destination', title: 'Bentota',           desc: 'River lagoon & luxury beach resorts',       tags: ['beach','luxury','water sports'],    url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/bentota-hm-feat.jpg' },
  { type: 'destination', title: 'Hikkaduwa',         desc: 'Coral reef snorkelling & surf',             tags: ['beach','diving','adventure'],       url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/hikka-hm-feat.jpg' },
  { type: 'destination', title: 'Jaffna',            desc: 'Tamil heritage & unique cuisine',           tags: ['cultural','heritage','north'],      url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/jaffna-hm-feat.jpg' },
  { type: 'destination', title: 'Colombo',           desc: 'Vibrant capital city & street food',        tags: ['city','culture','food'],            url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-1.jpg' },
  { type: 'destination', title: 'Pasikuda',          desc: 'Shallow calm turquoise bay',                tags: ['beach','east','snorkeling'],        url: 'destinations.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/arugambay.jpg' },

  // Packages
  { type: 'package', title: 'Cultural Triangle Discovery Tour',    desc: '7D/6N · Sigiriya, Kandy, Anuradhapura',     tags: ['cultural','heritage'],        url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/anuradhapura-hm-feat.jpg' },
  { type: 'package', title: 'Beach & Wildlife Safari Adventure',   desc: '8D/7N · Yala, Mirissa, Hikkaduwa',          tags: ['beach','wildlife','safari'],  url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/hikka-hm-feat.jpg' },
  { type: 'package', title: 'Hill Country & Tea Estates Escape',   desc: '5D/4N · Kandy, Nuwara Eliya, Ella',        tags: ['adventure','nature','hills'], url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-2.jpg' },
  { type: 'package', title: 'Luxury West Coast Beach Retreat',     desc: '6D/5N · Bentota, Hikkaduwa, Ayurveda',     tags: ['luxury','beach'],             url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/bentota-hm-feat.jpg' },
  { type: 'package', title: 'Grand Sri Lanka Circuit',             desc: '14D/13N · Island-wide full tour',           tags: ['cultural','wildlife'],        url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-3.jpg' },
  { type: 'package', title: 'East Coast Surf & Sun Escape',        desc: '7D/6N · Arugam Bay, Pasikuda, Trinco',     tags: ['adventure','beach'],          url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/arugambay.jpg' },
  { type: 'package', title: 'Jaffna Cultural Immersion',           desc: '4D/3N · Tamil heritage, north Sri Lanka',  tags: ['cultural'],                   url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/jaffna-hm-feat.jpg' },
  { type: 'package', title: 'Luxury Yala Safari Lodge Experience', desc: '4D/3N · Exclusive tented lodge, Yala',     tags: ['luxury','wildlife'],          url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-4.jpg' },
  { type: 'package', title: 'Kandy Heritage & Wellness Retreat',   desc: '5D/4N · Temple, dance shows, Ayurveda',    tags: ['luxury','cultural'],          url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/kandy.jpg' },
  { type: 'package', title: '3 Days Classic Sri Lanka Tour',       desc: '3D/2N · Sigiriya → Kandy → Ella',          tags: ['cultural','adventure'],       url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/truly-srilanka-banner-2.jpg' },
  { type: 'package', title: '3 Days South Coast Relax Tour',       desc: '3D/2N · Galle → Mirissa → Hikkaduwa',      tags: ['beach','adventure'],          url: 'packages.html', img: 'https://djpadb6zmchmi.cloudfront.net/2025/10/bentota-hm-feat.jpg' },
]

const MODAL_HTML = `
<div class="search-modal-overlay" id="searchOverlay">
  <div class="search-modal" role="dialog" aria-modal="true" aria-label="Site search">
    <div class="search-modal-header">
      <div>
        <h3>Search Tapro Travels</h3>
        <p>Find destinations, packages &amp; tours</p>
      </div>
      <button class="modal-close-btn" id="searchClose" aria-label="Close search">
        <ion-icon name="close-outline"></ion-icon>
      </button>
    </div>
    <div class="search-modal-body">
      <div class="search-input-wrap">
        <ion-icon name="search-outline" class="search-input-icon"></ion-icon>
        <input
          type="text"
          id="searchInput"
          class="search-input-field"
          placeholder="Search destinations, packages…"
          autocomplete="off"
          autofocus
        >
        <button class="search-input-clear" id="searchClear" aria-label="Clear">
          <ion-icon name="close-circle"></ion-icon>
        </button>
      </div>
      <div id="searchResults" class="search-results"></div>
    </div>
  </div>
</div>`

function injectModal() {
  if (document.getElementById('searchOverlay')) return
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML)
}

function renderResults(query) {
  const resultsEl = document.getElementById('searchResults')
  if (!resultsEl) return

  const q = query.trim().toLowerCase()

  if (!q) {
    resultsEl.innerHTML = `
      <p class="search-hint">
        <ion-icon name="compass-outline"></ion-icon>
        Try searching "beach", "safari", "Kandy", "luxury"…
      </p>`
    return
  }

  const matches = SEARCH_DATA.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q)  ||
    item.tags.some(t => t.includes(q))
  )

  if (!matches.length) {
    resultsEl.innerHTML = `
      <p class="search-no-results">
        <ion-icon name="search-outline"></ion-icon>
        No results for "<strong>${query}</strong>"
      </p>`
    return
  }

  const destinations = matches.filter(m => m.type === 'destination')
  const packages     = matches.filter(m => m.type === 'package')

  let html = ''

  if (destinations.length) {
    html += `<p class="search-group-label"><ion-icon name="location-outline"></ion-icon> Destinations</p>
    <div class="search-result-list">`
    destinations.forEach(item => {
      html += `
        <a href="${item.url}" class="search-result-item">
          <img src="${item.img}" alt="${item.title}" class="search-result-img">
          <div class="search-result-info">
            <p class="search-result-title">${highlight(item.title, q)}</p>
            <p class="search-result-desc">${highlight(item.desc, q)}</p>
          </div>
          <ion-icon name="chevron-forward-outline" class="search-result-arrow"></ion-icon>
        </a>`
    })
    html += `</div>`
  }

  if (packages.length) {
    html += `<p class="search-group-label"><ion-icon name="briefcase-outline"></ion-icon> Packages</p>
    <div class="search-result-list">`
    packages.forEach(item => {
      html += `
        <a href="${item.url}" class="search-result-item">
          <img src="${item.img}" alt="${item.title}" class="search-result-img">
          <div class="search-result-info">
            <p class="search-result-title">${highlight(item.title, q)}</p>
            <p class="search-result-desc">${highlight(item.desc, q)}</p>
          </div>
          <ion-icon name="chevron-forward-outline" class="search-result-arrow"></ion-icon>
        </a>`
    })
    html += `</div>`
  }

  resultsEl.innerHTML = html
}

function highlight(text, query) {
  if (!query) return text
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}

export function initSearch() {
  injectModal()

  const overlay   = document.getElementById('searchOverlay')
  const input     = document.getElementById('searchInput')
  const closeBtn  = document.getElementById('searchClose')
  const clearBtn  = document.getElementById('searchClear')
  const searchBtn = document.querySelector('.search-btn')

  function openSearch() {
    overlay.classList.add('active')
    document.body.style.overflow = 'hidden'
    setTimeout(() => input?.focus(), 50)
    renderResults('')
  }

  function closeSearch() {
    overlay.classList.remove('active')
    document.body.style.overflow = ''
    if (input) input.value = ''
    const resultsEl = document.getElementById('searchResults')
    if (resultsEl) resultsEl.innerHTML = ''
  }

  searchBtn?.addEventListener('click', openSearch)
  closeBtn?.addEventListener('click', closeSearch)
  clearBtn?.addEventListener('click', () => {
    if (input) { input.value = ''; input.focus() }
    renderResults('')
  })

  overlay?.addEventListener('click', e => {
    if (e.target === overlay) closeSearch()
  })

  input?.addEventListener('input', e => {
    clearBtn.style.display = e.target.value ? 'flex' : 'none'
    renderResults(e.target.value)
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch()
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch() }
  })
}
