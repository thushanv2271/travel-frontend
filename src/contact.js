const form     = document.getElementById('contactForm')
const feedback = document.getElementById('cf-feedback')

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    feedback.className = 'cf-feedback'
    feedback.textContent = ''

    const name    = form.elements['name'].value.trim()
    const email   = form.elements['email'].value.trim()
    const subject = form.elements['subject'].value
    const message = form.elements['message'].value.trim()

    if (!name || !email || !subject || !message) {
      feedback.classList.add('cf-feedback--error')
      feedback.textContent = 'Please fill in all required fields.'
      return
    }

    const btn = form.querySelector('.cf-submit')
    btn.disabled = true
    btn.textContent = 'Sending…'

    // Simulate async send — swap for a real API call when backend is ready
    await new Promise(r => setTimeout(r, 1200))

    feedback.classList.add('cf-feedback--success')
    feedback.textContent = "Thank you! We've received your message and will get back to you within 24 hours."
    form.reset()
    btn.disabled = false
    btn.innerHTML = '<ion-icon name="send"></ion-icon> Send Message'
  })
}
