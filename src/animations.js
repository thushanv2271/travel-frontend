import * as THREE from 'three'

// ===== PRELOADER =====
function initPreloader() {
  const preloader = document.getElementById('preloader')
  if (!preloader) return
  const fill = preloader.querySelector('.preloader-fill')

  // Force the progress bar to complete, then fade out
  window.addEventListener('load', () => {
    if (fill) fill.style.width = '100%'
    setTimeout(() => {
      preloader.classList.add('loaded')
      setTimeout(() => preloader.remove(), 700)
    }, 500)
  })

  // Failsafe — never block page for more than 4 s
  setTimeout(() => {
    preloader?.classList.add('loaded')
    setTimeout(() => preloader?.remove(), 700)
  }, 4000)
}

// ===== HERO BACKGROUND PARALLAX =====
function initHeroParallax() {
  const slides = document.querySelectorAll('.hero-slide')
  if (!slides.length) return

  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.35
    slides.forEach(s => {
      s.style.backgroundPositionY = `calc(50% + ${y}px)`
    })
  }, { passive: true })
}

// ===== HERO SLIDER =====
const SLIDE_CONTENT = [
  {
    title: 'Journey to the Pearl of the Indian Ocean',
    text:  'Discover Sri Lanka — where ancient temples rise among emerald hills, pristine beaches meet turquoise seas, and every journey reveals a new wonder. Your perfect island escape awaits.'
  },
  {
    title: 'Rise Above the Ancient Kingdom',
    text:  'Ascend the legendary Lion Rock — a 200-metre fortress rising from the jungle, adorned with timeless frescoes and breathtaking panoramic views that have awed travellers for centuries.'
  },
  {
    title: 'Where History Meets the Ocean',
    text:  'Step inside a UNESCO World Heritage city where centuries of Dutch colonial grandeur blend seamlessly with Sri Lanka\'s vibrant coastal culture, fresh seafood, and golden sunsets.'
  },
  {
    title: 'The Little England of Sri Lanka',
    text:  'Drift through mist-covered mountains and endless emerald tea estates on the world\'s most scenic train ride — a timeless journey through highland beauty and colonial charm.'
  },
  {
    title: 'Ride the Waves of Paradise',
    text:  'Where world-class surf meets untouched coastline. Arugam Bay beckons adventurers and dreamers to the sun-drenched shores of Sri Lanka\'s wild and breathtaking east coast.'
  },
  {
    title: 'The Cultural Heart of the Island',
    text:  'Discover Kandy — Sri Lanka\'s sacred cultural capital, home to the Temple of the Tooth Relic, vibrant Kandyan dance performances, and lush botanical gardens beside a shimmering lake.'
  }
]

function initHeroSlider() {
  const slides   = document.querySelectorAll('.hero-slide')
  const dots     = document.querySelectorAll('.hero-dot')
  const prevBtn  = document.querySelector('.hero-prev')
  const nextBtn  = document.querySelector('.hero-next')
  const fillBar  = document.getElementById('heroProgressFill')
  const hero     = document.querySelector('.hero')
  const titleEl  = document.querySelector('.hero-title')
  const textEl   = document.querySelector('.hero-text')

  if (!slides.length) return

  const INTERVAL = 5500
  const TICK     = 50
  const TEXT_OUT = 350  // ms for text fade-out before swap

  let current = 0
  let elapsed = 0
  let timer   = null
  let ticker  = null

  function updateText(index) {
    if (!titleEl || !textEl) return
    // Fade out
    titleEl.classList.add('hero-text-out')
    textEl.classList.add('hero-text-out')

    setTimeout(() => {
      titleEl.textContent = SLIDE_CONTENT[index].title
      textEl.textContent  = SLIDE_CONTENT[index].text
      // Fade in
      titleEl.classList.remove('hero-text-out')
      textEl.classList.remove('hero-text-out')
    }, TEXT_OUT)
  }

  function goTo(index) {
    slides[current].classList.remove('active')
    dots[current].classList.remove('active')
    current = (index + slides.length) % slides.length
    slides[current].classList.add('active')
    dots[current].classList.add('active')

    updateText(current)

    elapsed = 0
    if (fillBar) { fillBar.style.transition = 'none'; fillBar.style.width = '0%'; void fillBar.offsetWidth; fillBar.style.transition = '' }
  }

  function startAuto() {
    stopAuto()
    timer  = setInterval(() => goTo(current + 1), INTERVAL)
    ticker = setInterval(() => {
      elapsed += TICK
      if (fillBar) fillBar.style.width = `${Math.min((elapsed / INTERVAL) * 100, 100)}%`
    }, TICK)
  }

  function stopAuto() {
    clearInterval(timer)
    clearInterval(ticker)
  }

  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto() })
  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto() })
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto() }))

  hero?.addEventListener('mouseenter', stopAuto)
  hero?.addEventListener('mouseleave', startAuto)

  startAuto()
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
  const bar = document.createElement('div')
  bar.className = 'scroll-progress'
  document.body.prepend(bar)

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight
    bar.style.width = `${(window.scrollY / total) * 100}%`
  }, { passive: true })
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  function add(el, cls, delay = 0) {
    el.classList.add('reveal', cls)
    if (delay) el.style.transitionDelay = `${delay}ms`
    observer.observe(el)
  }

  const fadeUpSingles = [
    '.section-subtitle', '.section-title', '.section-text',
    '.page-hero-title', '.page-hero-text', '.filter-section',
    '.tour-search .container',
  ]
  fadeUpSingles.forEach(sel =>
    document.querySelectorAll(sel).forEach(el => add(el, 'reveal--up'))
  )

  const staggerGroups = [
    '.popular-list > li',
    '.package-list > li',
    '.gallery-item',
    '.pkg-item',
    '.dest-card',
    '.filter-btn',
  ]
  staggerGroups.forEach(sel =>
    document.querySelectorAll(sel).forEach((el, i) => add(el, 'reveal--up', i * 90))
  )

  document.querySelectorAll('.cta-content').forEach(el => add(el, 'reveal--left'))
  document.querySelectorAll('.cta .btn').forEach(el => add(el, 'reveal--right'))

  document.querySelectorAll('.footer-top .container > *').forEach((el, i) =>
    add(el, 'reveal--up', i * 120)
  )
}

// ===== CARD 3D TILT =====
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return // skip touch devices

  const cards = document.querySelectorAll('.popular-card, .package-card, .dest-card')
  const MAX = 8

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 2
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 2
      card.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease'
      card.style.transform  = `perspective(900px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg) translateZ(10px)`
      card.style.boxShadow  = `${-x * 10}px ${y * 10}px 32px rgba(0,0,0,0.18)`
    })
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.55s ease'
      card.style.transform  = ''
      card.style.boxShadow  = ''
    })
  })
}

// ===== BUTTON RIPPLE =====
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.style.position = 'relative'
    btn.style.overflow = 'hidden'

    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect()
      const size = Math.max(r.width, r.height) * 2
      const ripple = document.createElement('span')
      ripple.className = 'btn-ripple'
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size/2}px;top:${e.clientY - r.top - size/2}px;`
      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 700)
    })
  })
}

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    let rAF = null
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width  / 2) * 0.22
      const y = (e.clientY - r.top  - r.height / 2) * 0.22
      if (rAF) cancelAnimationFrame(rAF)
      rAF = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x}px, ${y}px)`
      })
    })
    btn.addEventListener('mouseleave', () => {
      if (rAF) cancelAnimationFrame(rAF)
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
      btn.style.transform  = ''
      setTimeout(() => btn.style.transition = '', 500)
    })
  })
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const els = document.querySelectorAll('[data-count]')
  if (!els.length) return

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      const target = parseInt(el.dataset.count, 10)
      const start = performance.now()
      const duration = 2000

      function update(now) {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - (1 - p) ** 3
        el.textContent = Math.round(eased * target).toLocaleString()
        if (p < 1) requestAnimationFrame(update)
      }
      requestAnimationFrame(update)
      observer.unobserve(el)
    })
  }, { threshold: 0.5 })

  els.forEach(el => observer.observe(el))
}

// ===== INIT =====
initPreloader()
initHeroSlider()
initHeroParallax()
initScrollProgress()
initScrollReveal()
initCardTilt()
initRipple()
initMagneticButtons()
initCounters()
