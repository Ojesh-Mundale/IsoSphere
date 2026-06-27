// Count-up helper
function animateCount(el, target){
  const start = 0;
  const duration = 900;
  const steps = 30;
  let i = 0;
  const tick = () => {
    i++;
    const t = i / steps;
    const eased = 1 - Math.pow(1 - t, 3);
    const val = start + (target - start) * eased;
    el.textContent = Number.isInteger(target) ? Math.round(val).toString() : val.toFixed(1);
    if (i < steps) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-count]').forEach(el => {
    const n = Number(el.getAttribute('data-count') || '0');
    if (!Number.isFinite(n)) return;
    animateCount(el, n);
  });

  // Simple timeline example chart if present
  const canvas = document.getElementById('timelineChart');
  if (canvas && window.Chart) {
    const ctx = canvas.getContext('2d');
    const data = [12, 18, 25, 34, 42, 48];
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Y1','Y2','Y3','Y4','Y5','Y6'],
        datasets: [{
          label: 'Impact',
          data,
          borderColor: 'rgba(0,212,255,.9)',
          backgroundColor: 'rgba(0,212,255,.15)',
          tension: .35,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,.08)' } } }
      }
    });
  }
});

