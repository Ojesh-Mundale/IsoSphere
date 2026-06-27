const dummyScenarios = {
  healthcare: {
    scenarioName: 'MRI Upgrade',
    techs: [
      { id:'pet', name:'PET Scan', invest: 60000000, op: 9500000, acc: 0.78, success: 0.64, env: -6 },
      { id:'mri', name:'MRI Upgrade', invest: 50000000, op: 8500000, acc: 0.72, success: 0.58, env: -4 },
      { id:'ct', name:'CT Scan', invest: 42000000, op: 7200000, acc: 0.66, success: 0.52, env: -3 }
    ]
  },
  agriculture: {
    scenarioName: 'Pest Crop Decline',
    techs: [
      { id:'chem', name:'Chemical Pesticides', invest: 9000000, op: 5200000, acc: 0.55, success: 0.48, env: -18 },
      { id:'sit', name:'Sterile Insect Technique', invest: 12500000, op: 2900000, acc: 0.62, success: 0.55, env: -9 },
      { id:'bio', name:'Biological Control', invest: 10500000, op: 2600000, acc: 0.59, success: 0.50, env: -8 }
    ]
  },
  food: {
    scenarioName: 'Increase Shelf Life',
    techs: [
      { id:'cold', name:'Cold Storage', invest: 18000000, op: 6200000, acc: 0.68, success: 0.57, env: -11 },
      { id:'chem', name:'Chemical Preservatives', invest: 9500000, op: 4100000, acc: 0.58, success: 0.49, env: -13 },
      { id:'irr', name:'Food Irradiation', invest: 14000000, op: 3600000, acc: 0.74, success: 0.61, env: -7 }
    ]
  },
  industry: {
    scenarioName: 'Quality Inspection',
    techs: [
      { id:'manual', name:'Manual Inspection', invest: 7000000, op: 4800000, acc: 0.52, success: 0.40, env: -4 },
      { id:'ultra', name:'Ultrasound', invest: 9800000, op: 3600000, acc: 0.64, success: 0.52, env: -6 },
      { id:'gamma', name:'Gamma Radiography', invest: 13200000, op: 3000000, acc: 0.70, success: 0.58, env: -7 }
    ]
  },
  research: {
    scenarioName: 'Isotope Production Planning',
    techs: [
      { id:'baseline', name:'Conventional Strategy', invest: 16000000, op: 5200000, acc: 0.60, success: 0.51, env: -10 },
      { id:'nuclear', name:'Nuclear-Backed Strategy', invest: 21000000, op: 4100000, acc: 0.73, success: 0.63, env: -7 },
      { id:'hybrid', name:'Hybrid Investment Plan', invest: 19000000, op: 3800000, acc: 0.68, success: 0.57, env: -8 }
    ]
  }
};

function computeResults(t){
  const investmentCost = t.invest;
  const operatingCost = t.op;
  const diagnosisAccuracy = t.acc;
  const treatmentSuccess = t.success;

  // very simple economic model (placeholder)
  const annualBenefit = investmentCost * (diagnosisAccuracy * 0.55 + treatmentSuccess * 0.35);
  const fiveYearReturn = (annualBenefit * 5 - (investmentCost + operatingCost * 5)) / (investmentCost + operatingCost * 5);
  const economicBenefit = Math.max(0, annualBenefit * 5 - (operatingCost * 5));
  const envImpact = t.env;
  const treatmentImpact = (diagnosisAccuracy * 60 + treatmentSuccess * 40); // 0..100-ish
  return {
    investmentCost,
    operatingCost,
    diagnosisAccuracy,
    treatmentSuccess,
    economicBenefit,
    envImpact,
    healthcareImpact: Math.round(treatmentImpact),
    fiveYearRoiPct: Math.round(fiveYearReturn * 100)
  };
}

function formatMoney(n){
  return '$' + Math.round(n).toLocaleString('en-US');
}

function renderCharts(result){
  const c1 = document.getElementById('resultChart');
  const c2 = document.getElementById('impactChart');
  if (!window.Chart || !c1 || !c2) return;

  // Hard-stop resize loops: force fixed canvas size.
  const FIXED_H = 240;
  c1.style.height = FIXED_H + 'px';
  c1.style.maxHeight = FIXED_H + 'px';
  c2.style.height = FIXED_H + 'px';
  c2.style.maxHeight = FIXED_H + 'px';

  const ctx1 = c1.getContext('2d');
  const ctx2 = c2.getContext('2d');

  if (window.__simChart1) window.__simChart1.destroy();
  if (window.__simChart2) window.__simChart2.destroy();

  window.__simChart1 = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Investment','Operating','Benefit'],
      datasets: [{
        data: [result.investmentCost, result.operatingCost, result.economicBenefit],
        backgroundColor: [
          'rgba(0,212,255,.55)',
          'rgba(255,255,255,.20)',
          'rgba(0,255,168,.45)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(255,255,255,.08)' },
          beginAtZero: true,
          // Prevent Chart.js autoscaling from expanding unexpectedly.
          suggestedMin: 0
        }
      }
    }
  });

  window.__simChart2 = new Chart(ctx2, {
    type: 'radar',
    data: {
      labels: ['Accuracy','Success','Healthcare','Env'],
      datasets: [{
        label:'Impact',
        data: [
          Math.round(result.diagnosisAccuracy*100),
          Math.round(result.treatmentSuccess*100),
          result.healthcareImpact,
          Math.max(0,100+result.envImpact)
        ],
        backgroundColor: 'rgba(0,212,255,.15)',
        borderColor: 'rgba(0,212,255,.9)'
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          grid: { color: 'rgba(255,255,255,.08)' },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  });
}



window.addEventListener('DOMContentLoaded', () => {
  const sectorSelect = document.getElementById('sectorSelect');
  const scenarioSelect = document.getElementById('scenarioSelect');
  const techSelect = document.getElementById('techSelect');
  const runBtn = document.getElementById('runBtn');
  const loadingBlock = document.getElementById('loadingBlock');
  const aiBox = document.getElementById('aiBox');

  const kpiInvestment = document.getElementById('kpiInvestment');
  const kpiOperating = document.getElementById('kpiOperating');
  const kpiAccuracy = document.getElementById('kpiAccuracy');

  function populateTechs(sector){
    techSelect.innerHTML = '';
    const techs = dummyScenarios[sector].techs;
    for (const t of techs){
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name;
      techSelect.appendChild(opt);
    }
  }

  function updateScenarioUI(sector){
    scenarioSelect.innerHTML = '';
    const opt = document.createElement('option');
    opt.value = dummyScenarios[sector].scenarioName;
    opt.textContent = dummyScenarios[sector].scenarioName;
    scenarioSelect.appendChild(opt);
  }

  sectorSelect.addEventListener('change', () => {
    updateScenarioUI(sectorSelect.value);
    populateTechs(sectorSelect.value);
  });

  updateScenarioUI(sectorSelect.value);
  populateTechs(sectorSelect.value);

  runBtn.addEventListener('click', async () => {
    loadingBlock.style.display = 'block';
    runBtn.disabled = true;
    aiBox.textContent = 'Generating economic insights…';

    const sector = sectorSelect.value;
    const techId = techSelect.value;
    const t = dummyScenarios[sector].techs.find(x => x.id === techId);
    if (!t) return;

    // simulate latency
    await new Promise(r => setTimeout(r, 300));

    // Call backend simulation API (server-side engine).
    let result = null;
    try {
      const resp = await fetch('/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, scenario: dummyScenarios[sector].scenarioName, tech_id: techId })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      result = await resp.json();
    } catch (e) {
      // Fallback to frontend dummy
      result = computeResults(t);
    }

    kpiInvestment.textContent = formatMoney(result.investmentCost);
    kpiOperating.textContent = formatMoney(result.operatingCost);
    kpiAccuracy.textContent = Math.round(result.diagnosisAccuracy * 100) + '%';

    renderCharts(result);

    // AI explanation via Ollama backend.
    aiBox.textContent = 'Generating AI explanation…';
    try {
      const promptQuestion = `What are the main limitations of deploying nuclear technology in ${sector} at scale?

Use the selected scenario: ${dummyScenarios[sector].scenarioName}.
Selected technology: ${t.name}.

Return in this exact format with these headings:
Summary
Economic Analysis
Advantages
Limitations
Recommendations

Rules:
- Simple non-technical language
- Avoid the words “via local Ollama” or “Ollama”
- Use the provided results values: investmentCost, operatingCost, diagnosisAccuracy, treatmentSuccess, fiveYearRoiPct, envImpact.
`;

      const resp = await fetch('/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: promptQuestion,
          context: {
            sector,
            scenario: dummyScenarios[sector].scenarioName,
            tech: t.name,
            results: result
          }
        })
      });


      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      aiBox.innerHTML = `<div class="small text-muted">Generated by local Ollama</div><div class="mt-2">${data.text.replaceAll('\n','<br/>')}</div>`;
    } catch (e) {
      const summary = `Summary: ${t.name} increases outcome quality and improves five-year ROI by balancing operating costs with measurable impact.`;
      const econ = `Economic Analysis: Five-year ROI is ${result.fiveYearRoiPct}% with an estimated economic benefit of ${formatMoney(result.economicBenefit)}.`;
      const adv = `Advantages: higher accuracy (${Math.round(result.diagnosisAccuracy * 100)}%), stronger success rate (${Math.round(result.treatmentSuccess * 100)}%).`;
      const lim = `Limitations: results depend on adoption and implementation constraints; environmental impact factor is ${result.environmentImpact} (lower is better).`;
      const rec = `Recommendations: pair ${t.name} with phased deployment and monitoring to protect ROI and sustain improvements.`;
      aiBox.innerHTML = `<div><strong>${summary}</strong></div><div class="mt-2">${econ}</div><div class="mt-2">${adv}</div><div class="mt-2">${lim}</div><div class="mt-2">${rec}</div>`;
    }

    loadingBlock.style.display = 'none';
    runBtn.disabled = false;
  });

});

