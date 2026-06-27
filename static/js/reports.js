window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('genReport');
  const link = document.getElementById('downloadLink');
  btn.addEventListener('click', async () => {
    // Placeholder until backend endpoint is implemented
    link.style.pointerEvents = 'auto';
    link.textContent = 'Demo PDF: generate endpoint pending.';
  });
});

