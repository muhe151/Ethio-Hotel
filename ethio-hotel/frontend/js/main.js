// Home page — featured rooms and nav auth state

document.addEventListener('DOMContentLoaded', async () => {
  // Update nav links based on auth state
  const user = await getCurrentUser();
  const authLinks = document.getElementById('authLinks');
  const userLinks = document.getElementById('userLinks');

  if (user) {
    if (authLinks) authLinks.style.display = 'none';
    if (userLinks) userLinks.style.display = 'contents';
  }

  // Load featured rooms (only on pages that have #featuredRooms)
  const featured = document.getElementById('featuredRooms');
  if (featured) {
    try {
      const rooms = await apiFetch('/rooms');
      featured.innerHTML = rooms.slice(0, 3).map(roomCard).join('');
    } catch (err) {
      featured.innerHTML = `<p style="color:red">Failed to load rooms: ${err.message}</p>`;
    }
  }
});

function roomCard(r) {
  const img = (r.images && r.images[0]) || 'https://via.placeholder.com/400x200?text=Room';
  return `
    <div class="card">
      <img src="${img}" alt="${r.name}">
      <div class="card-body">
        <h3>${r.name}</h3>
        <p>${r.type} • Sleeps ${r.capacity}</p>
        <p class="price">${r.pricePerNight} ETB / night</p>
        <a href="room-detail.html?id=${r._id}" class="btn" style="margin-top:1rem">View Details</a>
      </div>
    </div>
  `;
}