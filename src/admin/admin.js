import { API, apiGet, apiPost, apiPut, apiPatch, apiDelete, logout } from './api.js';

// ── Auth ─────────────────────────────────────────────────────────────────────
const token = localStorage.getItem('admin_token');
if (token) showPanel(); else showLogin();

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  btn.disabled = true; btn.textContent = 'Signing in…';
  const res = await apiPost('/api/auth/login', {
    username: document.getElementById('login-username').value,
    password: document.getElementById('login-password').value
  });
  if (res.ok) {
    localStorage.setItem('admin_token', res.data.token);
    localStorage.setItem('admin_user', res.data.username);
    showPanel();
  } else {
    const err = document.getElementById('login-error');
    err.textContent = 'Invalid username or password';
    err.classList.remove('hidden');
    btn.disabled = false; btn.textContent = 'Sign In';
  }
});

document.getElementById('logout-btn').addEventListener('click', logout);

function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
}

function showPanel() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');
  navigateTo('dashboard');
}

// ── Navigation ────────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});

function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === `page-${page}`));
  loadPage(page);
}

async function loadPage(page) {
  if (page === 'dashboard')    await loadDashboard();
  if (page === 'packages')     await loadPackages();
  if (page === 'destinations') await loadDestinations();
  if (page === 'bookings')     await loadBookings();
  if (page === 'inquiries')    await loadInquiries();
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function loadDashboard() {
  const stats = await apiGet('/api/dashboard/stats');
  if (!stats) return;
  document.getElementById('stat-packages').textContent     = stats.totalPackages;
  document.getElementById('stat-destinations').textContent = stats.totalDestinations;
  document.getElementById('stat-bookings').textContent     = stats.totalBookings;
  document.getElementById('stat-pending').textContent      = stats.pendingBookings;
  document.getElementById('stat-inquiries').textContent    = stats.unreadInquiries;
}

// ── Packages ──────────────────────────────────────────────────────────────────
async function loadPackages() {
  const items = await apiGet('/api/packages') ?? [];
  document.getElementById('packages-table-wrap').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Title</th><th>Destination</th><th>Price</th><th>Duration</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${items.map(p => `<tr>
          <td>${p.title}</td>
          <td>${p.destination}</td>
          <td>${p.currency} ${p.price}</td>
          <td>${p.durationDays} days</td>
          <td><span class="badge ${p.isActive ? 'active' : 'inactive'}">${p.isActive ? 'Active' : 'Inactive'}</span></td>
          <td class="actions">
            <button class="btn-edit" onclick="editPackage('${p.id}')">Edit</button>
            <button class="btn-delete" onclick="deletePackage('${p.id}')">Delete</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

document.getElementById('new-package-btn').addEventListener('click', () => openPackageModal(null));

window.editPackage = async id => {
  const pkg = await apiGet(`/api/packages/${id}`);
  if (pkg) openPackageModal(pkg);
};

window.deletePackage = async id => {
  if (!confirm('Delete this package?')) return;
  await apiDelete(`/api/packages/${id}`);
  await loadPackages();
};

function openPackageModal(pkg) {
  openModal(pkg ? 'Edit Package' : 'New Package', `
    <form id="pkg-form" class="admin-form">
      <div class="field"><label>Title</label><input name="title" value="${pkg?.title ?? ''}" required /></div>
      <div class="field"><label>Destination</label><input name="destination" value="${pkg?.destination ?? ''}" required /></div>
      <div class="field-row">
        <div class="field"><label>Price</label><input name="price" type="number" step="0.01" value="${pkg?.price ?? ''}" required /></div>
        <div class="field"><label>Currency</label>
          <select name="currency">
            <option ${pkg?.currency==='USD'?'selected':''}>USD</option>
            <option ${pkg?.currency==='LKR'?'selected':''}>LKR</option>
          </select>
        </div>
        <div class="field"><label>Duration (days)</label><input name="durationDays" type="number" value="${pkg?.durationDays ?? ''}" required /></div>
      </div>
      <div class="field"><label>Image URL</label><input name="imageUrl" value="${pkg?.imageUrl ?? ''}" /></div>
      <div class="field"><label>Description</label><textarea name="description" rows="3">${pkg?.description ?? ''}</textarea></div>
      <div class="field checkbox-field">
        <label><input type="checkbox" name="isActive" ${pkg?.isActive !== false ? 'checked' : ''} /> Active</label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
        <button type="submit" class="btn-primary">${pkg ? 'Update' : 'Create'}</button>
      </div>
    </form>`);

  document.getElementById('cancel-btn').addEventListener('click', closeModal);
  document.getElementById('pkg-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      title: fd.get('title'), destination: fd.get('destination'),
      price: parseFloat(fd.get('price')), currency: fd.get('currency'),
      durationDays: parseInt(fd.get('durationDays')),
      imageUrl: fd.get('imageUrl'), description: fd.get('description'),
      isActive: fd.get('isActive') === 'on',
      ...(pkg && { id: pkg.id })
    };
    const res = pkg ? await apiPut(`/api/packages/${pkg.id}`, body) : await apiPost('/api/packages', body);
    if (res.ok) { closeModal(); await loadPackages(); }
  });
}

// ── Destinations ──────────────────────────────────────────────────────────────
async function loadDestinations() {
  const items = await apiGet('/api/destinations') ?? [];
  document.getElementById('destinations-table-wrap').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Name</th><th>Location</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${items.map(d => `<tr>
          <td>${d.name}</td>
          <td>${d.location}</td>
          <td>${d.category}</td>
          <td><span class="badge ${d.isActive ? 'active' : 'inactive'}">${d.isActive ? 'Active' : 'Inactive'}</span></td>
          <td class="actions">
            <button class="btn-edit" onclick="editDestination('${d.id}')">Edit</button>
            <button class="btn-delete" onclick="deleteDestination('${d.id}')">Delete</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

document.getElementById('new-destination-btn').addEventListener('click', () => openDestinationModal(null));

window.editDestination = async id => {
  const dest = await apiGet(`/api/destinations/${id}`);
  if (dest) openDestinationModal(dest);
};

window.deleteDestination = async id => {
  if (!confirm('Delete this destination?')) return;
  await apiDelete(`/api/destinations/${id}`);
  await loadDestinations();
};

function openDestinationModal(dest) {
  openModal(dest ? 'Edit Destination' : 'New Destination', `
    <form id="dest-form" class="admin-form">
      <div class="field"><label>Name</label><input name="name" value="${dest?.name ?? ''}" required /></div>
      <div class="field"><label>Location</label><input name="location" value="${dest?.location ?? ''}" required /></div>
      <div class="field"><label>Category</label><input name="category" value="${dest?.category ?? ''}" /></div>
      <div class="field"><label>Image URL</label><input name="imageUrl" value="${dest?.imageUrl ?? ''}" /></div>
      <div class="field"><label>Description</label><textarea name="description" rows="3">${dest?.description ?? ''}</textarea></div>
      <div class="field checkbox-field">
        <label><input type="checkbox" name="isActive" ${dest?.isActive !== false ? 'checked' : ''} /> Active</label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
        <button type="submit" class="btn-primary">${dest ? 'Update' : 'Create'}</button>
      </div>
    </form>`);

  document.getElementById('cancel-btn').addEventListener('click', closeModal);
  document.getElementById('dest-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      name: fd.get('name'), location: fd.get('location'),
      category: fd.get('category'), imageUrl: fd.get('imageUrl'),
      description: fd.get('description'), isActive: fd.get('isActive') === 'on',
      ...(dest && { id: dest.id })
    };
    const res = dest ? await apiPut(`/api/destinations/${dest.id}`, body) : await apiPost('/api/destinations', body);
    if (res.ok) { closeModal(); await loadDestinations(); }
  });
}

// ── Bookings ──────────────────────────────────────────────────────────────────
async function loadBookings() {
  const items = await apiGet('/api/bookings') ?? [];
  document.getElementById('bookings-table-wrap').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Name</th><th>Package</th><th>Travel Date</th><th>Passengers</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${items.map(b => `<tr>
          <td>${b.fullName}<br><small>${b.email}</small></td>
          <td>${b.packageTitle || b.packageId}</td>
          <td>${new Date(b.travelDate).toLocaleDateString()}</td>
          <td>${b.passengers}</td>
          <td>${b.currency} ${b.totalPrice}</td>
          <td>
            <select class="status-select" onchange="updateBookingStatus('${b.id}', this.value)">
              ${['pending','confirmed','cancelled','completed'].map(s =>
                `<option ${b.status===s?'selected':''}>${s}</option>`).join('')}
            </select>
          </td>
          <td class="actions">
            <button class="btn-delete" onclick="deleteBooking('${b.id}')">Delete</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

window.updateBookingStatus = async (id, status) => {
  await apiPatch(`/api/bookings/${id}/status`, { status });
};

window.deleteBooking = async id => {
  if (!confirm('Delete this booking?')) return;
  await apiDelete(`/api/bookings/${id}`);
  await loadBookings();
};

// ── Inquiries ─────────────────────────────────────────────────────────────────
async function loadInquiries() {
  const items = await apiGet('/api/inquiries') ?? [];
  document.getElementById('inquiries-table-wrap').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Name</th><th>Subject</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${items.map(i => `<tr class="${i.isRead ? '' : 'unread'}">
          <td>${i.fullName}<br><small>${i.email}</small></td>
          <td>${i.subject}</td>
          <td>${new Date(i.createdAt).toLocaleDateString()}</td>
          <td><span class="badge ${i.isRead ? 'active' : 'inactive'}">${i.isRead ? 'Read' : 'Unread'}</span></td>
          <td class="actions">
            <button class="btn-edit" onclick="viewInquiry('${i.id}')">View</button>
            <button class="btn-delete" onclick="deleteInquiry('${i.id}')">Delete</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

window.viewInquiry = async id => {
  const inq = await apiGet(`/api/inquiries/${id}`);
  if (!inq) return;
  openModal('Inquiry', `
    <div class="inquiry-view">
      <p><strong>From:</strong> ${inq.fullName} &lt;${inq.email}&gt;</p>
      <p><strong>Phone:</strong> ${inq.phone || '—'}</p>
      <p><strong>Subject:</strong> ${inq.subject}</p>
      <p><strong>Date:</strong> ${new Date(inq.createdAt).toLocaleString()}</p>
      <hr />
      <p>${inq.message}</p>
      <div class="form-actions">
        <button class="btn-secondary" id="cancel-btn">Close</button>
      </div>
    </div>`);
  document.getElementById('cancel-btn').addEventListener('click', closeModal);
  if (!inq.isRead) {
    await apiPatch(`/api/inquiries/${id}/read`, {});
    await loadInquiries();
  }
};

window.deleteInquiry = async id => {
  if (!confirm('Delete this inquiry?')) return;
  await apiDelete(`/api/inquiries/${id}`);
  await loadInquiries();
};

// ── Modal helpers ─────────────────────────────────────────────────────────────
function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
