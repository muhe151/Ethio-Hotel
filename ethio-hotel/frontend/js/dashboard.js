// Dashboard helpers

async function loadDashboard() {
  const user = await requireAuth();
  if (!user) return;

  const welcome = document.getElementById('welcome');
  if (welcome) welcome.textContent = `Welcome back, ${user.name}!`;

  try {
    const bookings = await apiFetch('/bookings/my');

    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('confirmedBookings').textContent =
      bookings.filter(b => b.status === 'confirmed').length;
    document.getElementById('totalSpent').textContent =
      bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0)
        .toLocaleString();

    document.getElementById('bookingsTable').innerHTML = bookings.length
      ? bookings.map(bookingRow).join('')
      : '<tr><td colspan="6" style="text-align:center;color:#888">No bookings yet</td></tr>';
  } catch (err) {
    console.error('Dashboard error:', err);
  }
}

function bookingRow(b) {
  const roomName = b.room ? b.room.name : 'N/A';
  const checkIn = new Date(b.checkIn).toLocaleDateString();
  const checkOut = new Date(b.checkOut).toLocaleDateString();
  const statusColor = b.status === 'confirmed' ? 'green'
                    : b.status === 'cancelled' ? 'red'
                    : 'orange';
  const action = (b.status === 'pending' || b.status === 'confirmed')
    ? `<button onclick="cancelBooking('${b._id}')" class="btn" style="padding:.3rem .8rem;font-size:.85rem">Cancel</button>`
    : '-';

  return `
    <tr>
      <td>${roomName}</td>
      <td>${checkIn}</td>
      <td>${checkOut}</td>
      <td>${b.totalPrice.toLocaleString()} ETB</td>
      <td><span style="color:${statusColor}">${b.status}</span></td>
      <td>${action}</td>
    </tr>
  `;
}

async function cancelBooking(id) {
  if (!confirm('Cancel this booking?')) return;
  try {
    await apiFetch(`/bookings/${id}/cancel`, { method: 'PUT' });
    location.reload();
  } catch (err) {
    alert('Failed: ' + err.message);
  }
}

if (document.getElementById('bookingsTable')) {
  loadDashboard();
}