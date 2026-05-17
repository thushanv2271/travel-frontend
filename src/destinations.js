import { initCurrency }   from './currency.js'
import { initSearch }     from './search.js'
import { initAdminLogin } from './admin-login.js'
initCurrency()
initSearch()
initAdminLogin()

// Navbar toggle
const overlay = document.querySelector('[data-overlay]')
const navOpenBtn = document.querySelector('[data-nav-open-btn]')
const navbar = document.querySelector('[data-navbar]')
const navCloseBtn = document.querySelector('[data-nav-close-btn]')
const navLinks = document.querySelectorAll('[data-nav-link]')

function toggleNav() {
  navbar.classList.toggle('active')
  overlay.classList.toggle('active')
}

navOpenBtn?.addEventListener('click', toggleNav)
navCloseBtn?.addEventListener('click', toggleNav)
overlay?.addEventListener('click', toggleNav)
navLinks.forEach(link => link.addEventListener('click', toggleNav))

// Header sticky + go-top
const header = document.querySelector('[data-header]')
const goTopBtn = document.querySelector('[data-go-top]')

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY >= 200
  header?.classList.toggle('active', scrolled)
  goTopBtn?.classList.toggle('active', scrolled)
})

// Destination filter
const filterBtns = document.querySelectorAll('.filter-btn')
const destCards = document.querySelectorAll('.dest-card')
const noResults = document.getElementById('noResults')

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')

    const filter = btn.dataset.filter
    let visibleCount = 0

    destCards.forEach(card => {
      const match = filter === 'all' || card.dataset.region === filter
      if (match) {
        card.classList.remove('dest-card--hidden')
        visibleCount++
      } else {
        card.classList.add('dest-card--hidden')
      }
    })

    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none'
  })
})
