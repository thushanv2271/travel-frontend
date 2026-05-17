import { initCurrency }    from './currency.js'
import { initSearch }      from './search.js'
import { initAdminLogin }  from './admin-login.js'
import { initUserNav }     from './user-auth.js'
initCurrency()
initSearch()
initAdminLogin()
initUserNav()

// ===== NAVBAR TOGGLE =====
const overlay    = document.querySelector('[data-overlay]')
const navOpenBtn = document.querySelector('[data-nav-open-btn]')
const navbar     = document.querySelector('[data-navbar]')
const navCloseBtn= document.querySelector('[data-nav-close-btn]')
const navLinks   = document.querySelectorAll('[data-nav-link]')

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

