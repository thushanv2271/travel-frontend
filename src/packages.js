import { initCurrency } from './currency.js'
import { initSearch }   from './search.js'
import { initUserNav }  from './user-auth.js'
initCurrency()
initSearch()
initUserNav()

// Navbar toggle
const overlay = document.querySelector('[data-overlay]')
const navOpenBtn = document.querySelector('[data-nav-open-btn]')
const navbar = document.querySelector('[data-navbar]')
const navCloseBtn = document.querySelector('[data-nav-close-btn]')
const navLinks = document.querySelectorAll('[data-nav-link]')

function toggleNav() {
  navbar?.classList.toggle('active')
  overlay?.classList.toggle('active')
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

// Package filter
const filterBtns = document.querySelectorAll('.filter-btn')
const pkgItems = document.querySelectorAll('.pkg-item')
const noResults = document.getElementById('noResults')

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')

    const filter = btn.dataset.filter
    let visibleCount = 0

    pkgItems.forEach(item => {
      const categories = item.dataset.category ?? ''
      const match = filter === 'all' || categories.split(' ').includes(filter)
      item.classList.toggle('pkg-item--hidden', !match)
      if (match) visibleCount++
    })

    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none'
  })
})
