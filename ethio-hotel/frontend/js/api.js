const API = '/api';

async function apiFetch(path, options = {}) {
  const method = options.method || 'GET';
  const body = options.body || null;
  
  const config = {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    config.body = body;
  }

  const res = await fetch(API + path, config);
  const text = await res.text();
  
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error('Server error (' + res.status + '): ' + text.slice(0, 100));
  }

  if (!res.ok) {
    throw new Error(data.message || 'Request failed (' + res.status + ')');
  }
  
  return data;
}

async function getCurrentUser() {
  try { 
    const data = await apiFetch('/auth/me'); 
    return data.user; 
  } catch { 
    return null; 
  }
}

async function logout() {
  try { 
    await apiFetch('/auth/logout', { method: 'POST' }); 
  } catch {} 
  window.location.href = 'index.html';
}