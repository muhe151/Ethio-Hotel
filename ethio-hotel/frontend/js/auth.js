// Auth helpers — used by login/signup pages

async function handleLogin(email, password) {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

async function handleRegister(name, email, phone, password) {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password })
  });
}

async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

async function requireGuest() {
  const user = await getCurrentUser();
  if (user) {
    window.location.href = 'dashboard.html';
  }
  return user;
}