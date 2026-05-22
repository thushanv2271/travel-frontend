// ===== ADMIN LOGIN MODAL =====
const ADMIN_URL = 'http://localhost:5000'

const MODAL_HTML = `
<div class="admin-login-overlay" id="adminLoginOverlay">
  <div class="admin-login-modal" role="dialog" aria-modal="true" aria-label="Admin login">
    <div class="admin-login-header">
      <div>
        <div class="admin-login-logo">Tapro <em>Travels</em></div>
        <p class="admin-login-subtitle">Admin Portal</p>
      </div>
      <button class="admin-login-close" id="adminLoginClose" aria-label="Close">&#10005;</button>
    </div>
    <div class="admin-login-body">
      <div id="adminLoginError" class="admin-login-error" style="display:none;"></div>
      <div class="admin-login-field">
        <label>Username</label>
        <input type="text" id="adminUsername" placeholder="admin" autocomplete="username"/>
      </div>
      <div class="admin-login-field">
        <label>Password</label>
        <input type="password" id="adminPassword" placeholder="••••••••" autocomplete="current-password"/>
      </div>
      <button class="admin-login-btn" id="adminLoginBtn">
        <span id="adminLoginLabel">Sign In to Admin</span>
        <span id="adminLoginSpinner" style="display:none;">Signing in…</span>
      </button>
      <p class="admin-login-hint">Access to authorised personnel only.</p>
    </div>
  </div>
</div>`

function injectModal() {
  if (document.getElementById('adminLoginOverlay')) return
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML)
}

function openModal() {
  document.getElementById('adminLoginOverlay')?.classList.add('active')
  document.body.style.overflow = 'hidden'
  setTimeout(() => document.getElementById('adminUsername')?.focus(), 80)
}

function closeModal() {
  document.getElementById('adminLoginOverlay')?.classList.remove('active')
  document.body.style.overflow = ''
  clearError()
}

function showError(msg) {
  const el = document.getElementById('adminLoginError')
  if (!el) return
  el.textContent = msg
  el.style.display = 'block'
}

function clearError() {
  const el = document.getElementById('adminLoginError')
  if (el) el.style.display = 'none'
}

function setLoading(loading) {
  const btn     = document.getElementById('adminLoginBtn')
  const label   = document.getElementById('adminLoginLabel')
  const spinner = document.getElementById('adminLoginSpinner')
  if (!btn) return
  btn.disabled       = loading
  label.style.display  = loading ? 'none' : 'inline'
  spinner.style.display = loading ? 'inline' : 'none'
}

async function doLogin() {
  const username = document.getElementById('adminUsername')?.value.trim()
  const password = document.getElementById('adminPassword')?.value

  if (!username || !password) { showError('Please enter both username and password.'); return }

  clearError()
  setLoading(true)

  try {
    const res = await fetch(`${ADMIN_URL}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password })
    })

    const data = await res.json()

    if (res.ok && data.token) {
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', data.username)
      document.getElementById('adminLoginLabel').textContent = 'Redirecting…'
      window.location.href = '/admin.html'
    } else {
      showError(data.message || 'Login failed. Please try again.')
      setLoading(false)
    }
  } catch {
    showError('Cannot connect to admin server. Make sure the backend is running.')
    setLoading(false)
  }
}

export function initAdminLogin() {
  injectModal()

  document.getElementById('adminLoginClose')?.addEventListener('click', closeModal)

  document.getElementById('adminLoginOverlay')?.addEventListener('click', e => {
    if (e.target.id === 'adminLoginOverlay') closeModal()
  })

  document.getElementById('adminLoginBtn')?.addEventListener('click', doLogin)

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal()
    if (e.key === 'Enter' && document.getElementById('adminLoginOverlay')?.classList.contains('active')) doLogin()
  })

  // Wire up all admin-login trigger buttons
  document.querySelectorAll('[data-admin-login]').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); openModal() })
  )
}
