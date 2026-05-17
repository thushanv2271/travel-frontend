const USER_KEY = 'tt_user';
const TOKEN_KEY = 'tt_token';

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = 'index.html';
}

export function initUserNav() {
  const user = getUser();
  const container = document.getElementById('user-nav-area');
  if (!container) return;

  if (user) {
    container.innerHTML = `
      <div class="user-nav-avatar" id="user-nav-toggle">
        ${user.picture
          ? `<img src="${user.picture}" alt="${user.name}" class="user-avatar-img" />`
          : `<span class="user-avatar-initials">${user.name.charAt(0).toUpperCase()}</span>`
        }
        <span class="user-nav-name">${user.name.split(' ')[0]}</span>
      </div>
      <div class="user-nav-dropdown hidden" id="user-nav-dropdown">
        <div class="user-nav-info">
          <strong>${user.name}</strong>
          <small>${user.email}</small>
        </div>
        <hr />
        <button id="user-logout-btn" class="user-nav-logout">Sign Out</button>
      </div>
    `;

    document.getElementById('user-nav-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('user-nav-dropdown').classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      document.getElementById('user-nav-dropdown')?.classList.add('hidden');
    });

    document.getElementById('user-logout-btn').addEventListener('click', logout);
  } else {
    container.innerHTML = `<a href="login.html" class="user-nav-login-btn" aria-label="Sign In"><ion-icon name="person-outline"></ion-icon></a>`;
  }
}
