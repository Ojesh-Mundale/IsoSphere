const dummyCompare = {
  healthcare: {
    labels: ['Traditional','Nuclear'],
    initCost: [42000000, 60000000],
    opCost: [7800000, 9500000],
    efficiency: [72, 81],
    roi: [8, 18],
    env: [62, 74]
  }
};

function makeSector(){
  return document.getElementById('compareSector').value;
}

function formatMoney(n){
  return '$' + Math.round(n).toLocaleString('en-US');
}

window.addEventListener('DOMContentLoaded', () => {
  const sectorSelect = document.getElementById('compareSector');
  const btn = document.getElementById('compareRun');
  const insights = document.getElementById('compareInsights');

  const bar = document.getElementById('compareBar');
  const radar = document.getElementById('compareRadar');

  function render(data){
    if (window.__cmpBar) window.__cmpBar.destroy();
    if (window.__cmpRadar) window.__cmpRadar.destroy();

    if (window.Chart && bar){
      window.__cmpBar = new Chart(bar.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Investment','Operating','ROI'],
          datasets: [{
            label: 'Traditional vs Nuclear',
            data: [data.initCost[0], data.opCost[0], data.roi[0], data.initCost[1], data.opCost[1], data.roi[1]],
          }]
        }
      });
    }

    if (window.Chart && radar){
      window.__cmpRadar = new Chart(radar.getContext('2d'), {
        type: 'radar',
        data: {
          labels: ['Efficiency','ROI','Environmental','Init cost'],
          datasets: [
            {label:'Traditional', data:[data.efficiency[0], data.roi[0], data.env[0], 70], backgroundColor:'rgba(255,255,255,.08)', borderColor:'rgba(255,255,255,.65)'},
            {label:'Nuclear', data:[data.efficiency[1], data.roi[1], data.env[1], 55], backgroundColor:'rgba(0,212,255,.12)', borderColor:'rgba(0,212,255,.9)'}
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels:{ color:'#fff' } } },
          scales: { r: { grid: { color: 'rgba(255,255,255,.08)' }, angleLines:{ color:'rgba(255,255,255,.08)' } } }
        }
      });
    }
  }

  btn.addEventListener('click', () => {
    // placeholder: only healthcare implemented
    const sector = makeSector();
    const data = dummyCompare[sector] || dummyCompare.healthcare;

    const [tInit, nInit] = data.initCost;
    const [tOp, nOp] = data.opCost;
    const [tRoi, nRoi] = data.roi;

    insights.innerHTML = `<div><strong>Economic Snapshot</strong></div>
      <div class="mt-2 text-muted">Initial costs: Traditional ${formatMoney(tInit)} vs Nuclear ${formatMoney(nInit)}</div>
      <div class="mt-2 text-muted">Operating costs: Traditional ${formatMoney(tOp)} vs Nuclear ${formatMoney(nOp)}</div>
      <div class="mt-2 text-muted">ROI: Traditional ${tRoi}% vs Nuclear ${nRoi}%</div>
      <div class="mt-3">Nuclear option tends to win when accuracy and sustained impact outweigh higher adoption investment.</div>`;

    render(data);
  });
});

