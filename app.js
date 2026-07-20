/* ==========================================================================
   AICAF — app.js
   Wizard state, rendering, scoring engine, and report generation.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------- Analytics ----------------
     Fires GA4 events if gtag() is loaded (see index.html <head> — requires a
     real Measurement ID to actually report data). Safe no-op otherwise, so
     the app never breaks if analytics is blocked, missing, or not yet set up. */
  function trackEvent(name, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, params || {});
      }
    } catch (e) {
      /* never let analytics break the app */
    }
  }

  /* ---------------- Theme ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    iconSun.classList.toggle('hidden', theme === 'dark');
    iconMoon.classList.toggle('hidden', theme !== 'dark');
  }
  let currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(currentTheme);
  themeToggle.addEventListener('click', function () {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
  });

  /* ---------------- Toast ---------------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
  }

  /* ---------------- State ---------------- */
  const state = {
    companySize: null,
    industry: null,
    techEnv: null,
    composition: {},
    maturity: null,
    priorities: [],
    dataSensitivity: null,
    policyStatus: null,
    activities: [],
    lead: { name: '', org: '', email: '' },
  };
  COMPOSITION_CATEGORIES.forEach((c) => (state.composition[c.id] = 0));

  const TOTAL_STEPS = 5;
  let currentStep = 1;

  const STEP_NAMES = {
    1: 'Organization Profile',
    2: 'Workforce Composition',
    3: 'AI Maturity',
    4: 'Priorities & Governance',
    5: 'Review',
  };

  /* ---------------- Option-card rendering ---------------- */
  const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  function renderOptionCards(containerId, items, name, type, maxSelections) {
    const container = document.getElementById(containerId);
    container.innerHTML = items
      .map((item) => {
        const extra = item.desc ? `<div class="opt-card__desc">${item.desc}</div>` : '';
        return `
        <label class="opt-card ${type === 'checkbox' ? 'opt-card--checkbox' : ''}" data-value="${item.id}">
          <input type="${type}" name="${name}" value="${item.id}" ${type === 'radio' ? 'required' : ''} />
          <div class="opt-card__title">
            <span>${item.label}</span>
            <span class="opt-card__check">${checkSvg}</span>
          </div>
          ${extra}
        </label>`;
      })
      .join('');

    container.querySelectorAll('input').forEach((input) => {
      input.addEventListener('change', () => {
        if (type === 'radio') {
          state[name] = input.value;
          container.querySelectorAll('.opt-card').forEach((c) => c.classList.remove('is-checked'));
          input.closest('.opt-card').classList.add('is-checked');
        } else {
          // checkbox with optional max
          const checked = Array.from(container.querySelectorAll('input:checked')).map((i) => i.value);
          if (maxSelections && checked.length > maxSelections) {
            input.checked = false;
            showToast(`You can select up to ${maxSelections}`);
            return;
          }
          state[name] = checked;
          input.closest('.opt-card').classList.toggle('is-checked', input.checked);
        }
      });
    });
  }

  function renderMaturityCards() {
    const container = document.getElementById('opt-maturity');
    container.innerHTML = MATURITY_LEVELS
      .map(
        (lvl) => `
      <label class="opt-card opt-card--level" data-value="${lvl.id}">
        <input type="radio" name="maturity" value="${lvl.id}" required />
        <span class="opt-card__badge">${lvl.id}</span>
        <div>
          <div class="opt-card__title"><span>${lvl.name}</span><span class="opt-card__check">${checkSvg}</span></div>
          <div class="opt-card__desc">${lvl.short}</div>
          <ul>${lvl.signals.map((s) => `<li>${s}</li>`).join('')}</ul>
        </div>
      </label>`
      )
      .join('');
    container.querySelectorAll('input').forEach((input) => {
      input.addEventListener('change', () => {
        state.maturity = input.value;
        container.querySelectorAll('.opt-card').forEach((c) => c.classList.remove('is-checked'));
        input.closest('.opt-card').classList.add('is-checked');
      });
    });
  }

  renderOptionCards('opt-companySize', COMPANY_SIZES, 'companySize', 'radio');
  renderOptionCards('opt-industry', INDUSTRIES, 'industry', 'radio');
  renderOptionCards('opt-techEnv', TECH_ENVIRONMENTS, 'techEnv', 'radio');
  renderMaturityCards();
  renderOptionCards('opt-priorities', PRIORITIES, 'priorities', 'checkbox', 3);
  renderOptionCards('opt-dataSensitivity', YES_NO, 'dataSensitivity', 'radio');
  renderOptionCards('opt-policyStatus', YES_NO_INPROGRESS, 'policyStatus', 'radio');
  renderOptionCards('opt-activities', ACTIVITIES.map((a) => ({ id: a.id, label: a.label, desc: a.desc })), 'activities', 'checkbox', 5);

  /* ---------------- Allocator (workforce composition) ---------------- */
  const allocatorRows = document.getElementById('allocator-rows');
  allocatorRows.innerHTML = COMPOSITION_CATEGORIES
    .map(
      (c) => `
    <div class="allocator-row" data-cat="${c.id}">
      <span class="allocator-row__label">${c.label}</span>
      <input type="range" min="0" max="100" value="0" step="1" data-cat="${c.id}" aria-label="${c.label} percent" />
      <span class="allocator-row__value" data-cat-value="${c.id}">0%</span>
    </div>`
    )
    .join('');

  const allocatorTotalEl = document.getElementById('allocator-total');

  function updateAllocatorTotal() {
    const total = COMPOSITION_CATEGORIES.reduce((sum, c) => sum + state.composition[c.id], 0);
    allocatorTotalEl.textContent = total + '%';
    allocatorTotalEl.classList.toggle('is-good', total === 100);
    allocatorTotalEl.classList.toggle('is-off', total !== 100);
  }

  allocatorRows.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener('input', () => {
      const cat = input.dataset.cat;
      state.composition[cat] = parseInt(input.value, 10);
      document.querySelector(`[data-cat-value="${cat}"]`).textContent = state.composition[cat] + '%';
      updateAllocatorTotal();
    });
  });

  document.getElementById('auto-balance-btn').addEventListener('click', () => {
    const total = COMPOSITION_CATEGORIES.reduce((sum, c) => sum + state.composition[c.id], 0);
    if (total === 0) {
      const even = Math.floor(100 / COMPOSITION_CATEGORIES.length);
      let remainder = 100 - even * COMPOSITION_CATEGORIES.length;
      COMPOSITION_CATEGORIES.forEach((c, i) => {
        state.composition[c.id] = even + (remainder-- > 0 ? 1 : 0);
      });
    } else {
      let running = 0;
      COMPOSITION_CATEGORIES.forEach((c, i) => {
        const scaled = i === COMPOSITION_CATEGORIES.length - 1 ? 100 - running : Math.round((state.composition[c.id] / total) * 100);
        state.composition[c.id] = scaled;
        running += scaled;
      });
    }
    COMPOSITION_CATEGORIES.forEach((c) => {
      allocatorRows.querySelector(`input[data-cat="${c.id}"]`).value = state.composition[c.id];
      document.querySelector(`[data-cat-value="${c.id}"]`).textContent = state.composition[c.id] + '%';
    });
    updateAllocatorTotal();
    showToast('Balanced to 100%');
  });

  /* ---------------- Wizard navigation ---------------- */
  const progressEl = document.getElementById('progress');
  progressEl.innerHTML = Array.from({ length: TOTAL_STEPS })
    .map(() => '<div class="progress__seg"><span></span></div>')
    .join('');
  const progressTextEl = document.getElementById('progress-text');
  const progressNameEl = document.getElementById('progress-name');
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');
  const generateBtn = document.getElementById('generate-btn');

  function renderProgress() {
    progressEl.querySelectorAll('.progress__seg > span').forEach((span, i) => {
      span.style.width = i < currentStep ? '100%' : '0%';
    });
    progressTextEl.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
    progressNameEl.textContent = STEP_NAMES[currentStep];
  }

  function showStep(step) {
    document.querySelectorAll('.step').forEach((el) => {
      el.classList.toggle('hidden', parseInt(el.dataset.step, 10) !== step);
    });
    backBtn.classList.toggle('hidden', step === 1);
    nextBtn.classList.toggle('hidden', step === TOTAL_STEPS);
    generateBtn.classList.toggle('hidden', step !== TOTAL_STEPS);
    if (step === TOTAL_STEPS) renderReview();
    renderProgress();
    trackEvent('wizard_step_view', { step_number: step, step_name: STEP_NAMES[step] });
    document.getElementById('wizard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    if (step === 1) {
      if (!state.companySize) return 'Pick a company size';
      if (!state.industry) return 'Pick an industry';
      if (!state.techEnv) return 'Pick a technology environment';
    }
    if (step === 2) {
      const total = COMPOSITION_CATEGORIES.reduce((sum, c) => sum + state.composition[c.id], 0);
      if (total === 0) return 'Add your workforce composition (or use Auto-balance)';
    }
    if (step === 3) {
      if (state.maturity === null) return 'Pick your current AI maturity level';
    }
    if (step === 4) {
      if (state.priorities.length === 0) return 'Pick at least one priority';
      if (!state.dataSensitivity) return 'Answer the data sensitivity question';
      if (!state.policyStatus) return 'Answer the policy question';
      if (state.activities.length < 3) return 'Pick at least 3 business activities';
    }
    return null;
  }

  nextBtn.addEventListener('click', () => {
    const err = validateStep(currentStep);
    if (err) {
      showToast(err);
      return;
    }
    currentStep = Math.min(TOTAL_STEPS, currentStep + 1);
    showStep(currentStep);
  });
  backBtn.addEventListener('click', () => {
    currentStep = Math.max(1, currentStep - 1);
    showStep(currentStep);
  });

  document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('intro').classList.add('hidden');
    document.getElementById('wizard').classList.remove('hidden');
    currentStep = 1;
    trackEvent('assessment_start');
    showStep(currentStep);
  });

  const ctaTalkBtn = document.getElementById('cta-talk-btn');
  if (ctaTalkBtn) {
    ctaTalkBtn.addEventListener('click', () => trackEvent('cta_lets_talk_clicked'));
  }

  /* ---------------- Review ---------------- */
  function label(list, id) {
    const found = list.find((i) => String(i.id) === String(id));
    return found ? found.label || found.name : id;
  }

  function renderReview() {
    const grid = document.getElementById('review-grid');
    const topComposition = COMPOSITION_CATEGORIES.filter((c) => state.composition[c.id] > 0)
      .sort((a, b) => state.composition[b.id] - state.composition[a.id])
      .map((c) => `${c.label} ${state.composition[c.id]}%`)
      .join(', ');
    const items = [
      ['Company size', label(COMPANY_SIZES, state.companySize)],
      ['Industry', label(INDUSTRIES, state.industry)],
      ['Tech environment', label(TECH_ENVIRONMENTS, state.techEnv)],
      ['AI maturity', MATURITY_LEVELS[state.maturity].id + ' — ' + MATURITY_LEVELS[state.maturity].name],
      ['Workforce composition', topComposition || '—'],
      ['Priorities', state.priorities.map((p) => label(PRIORITIES, p)).join(', ') || '—'],
      ['Sensitive/regulated data', label(YES_NO, state.dataSensitivity)],
      ['AI policy today', label(YES_NO_INPROGRESS, state.policyStatus)],
      ['Business activities', state.activities.map((a) => label(ACTIVITIES, a)).join(', ') || '—'],
    ];
    grid.innerHTML = items
      .map((i) => `<div class="review-item"><div class="review-item__label">${i[0]}</div><div class="review-item__value">${i[1]}</div></div>`)
      .join('');
  }

  document.getElementById('lead-name').addEventListener('input', (e) => (state.lead.name = e.target.value));
  document.getElementById('lead-org').addEventListener('input', (e) => (state.lead.org = e.target.value));
  document.getElementById('lead-email').addEventListener('input', (e) => (state.lead.email = e.target.value));

  document.getElementById('edit-answers-btn').addEventListener('click', () => {
    document.getElementById('results').classList.remove('is-visible');
    document.getElementById('wizard').classList.remove('hidden');
    currentStep = TOTAL_STEPS;
    showStep(currentStep);
  });

  document.getElementById('logo-home').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('results').classList.remove('is-visible');
    document.getElementById('wizard').classList.add('hidden');
    document.getElementById('intro').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ================================================================
     SCORING ENGINE
     ================================================================ */

  function freqLabel(n) {
    return n >= 2.5 ? 'High' : n >= 1.75 ? 'Medium' : 'Low';
  }
  function potentialLabel(n) {
    return n >= 3.5 ? 'Very High' : n >= 2.5 ? 'High' : n >= 1.5 ? 'Medium' : 'Low';
  }

  function computeReport() {
    // 1. Persona shares from composition
    const totalComp = COMPOSITION_CATEGORIES.reduce((s, c) => s + state.composition[c.id], 0) || 1;
    const personaShare = {};
    PERSONAS.forEach((p) => {
      const raw = p.compositionKeys.reduce((s, k) => s + state.composition[k], 0);
      personaShare[p.id] = raw / totalComp; // 0..1
    });

    const maturity = MATURITY_LEVELS[parseInt(state.maturity, 10)];

    // 2. Persona ranking
    const personaRanking = PERSONAS.map((p) => ({
      ...p,
      share: personaShare[p.id],
      priorityScore: personaShare[p.id] * p.impact,
    })).sort((a, b) => b.priorityScore - a.priorityScore);
    const topPersonaIds = personaRanking.filter((p) => p.share > 0).slice(0, 3).map((p) => p.id);

    // 3. Capability roadmap (only personas with share > 0)
    const roadmap = personaRanking
      .filter((p) => p.share > 0)
      .map((p) => {
        const nowLevel = Math.max(1, Math.min(p.targetLevel, maturity.id + 1));
        return {
          persona: p,
          nowLevel,
          targetLevel: p.targetLevel,
          nowDef: CAPABILITY_LEVELS[nowLevel - 1],
          targetDef: CAPABILITY_LEVELS[p.targetLevel - 1],
          resources: (TRAINING_RESOURCES[p.targetLevel] || []).slice(0, 3),
        };
      });

    // 4. Platform recommendations
    const scenarioKeys = ['research', 'writing'];
    if (state.techEnv === 'microsoft' || state.techEnv === 'mixed') scenarioKeys.push('msProductivity');
    if (state.techEnv === 'google' || state.techEnv === 'mixed') scenarioKeys.push('googleProductivity');
    if (personaShare.G > 0.04 || state.industry === 'technology') scenarioKeys.push('softwareDev');
    if (state.companySize === 'midmarket' || state.companySize === 'enterprise' || maturity.id >= 3) scenarioKeys.push('enterpriseAI');
    const platforms = scenarioKeys.map((key) => ({
      key,
      ...PLATFORM_SCENARIOS[key],
      recommended: ['msProductivity', 'googleProductivity'].includes(key),
    }));

    // 5. Governance plan — always show all 5, flag priority ones
    const governance = Object.entries(GOVERNANCE_RESOURCES).map(([key, cat]) => ({
      key,
      ...cat,
      flag:
        key === 'acceptableUse' && state.policyStatus !== 'yes'
          ? 'Start here'
          : key === 'privacy' && state.dataSensitivity === 'yes'
          ? 'Priority for you'
          : null,
    }));

    // 6. Business activity table
    const activityRows = state.activities
      .map((id) => ACTIVITIES.find((a) => a.id === id))
      .filter(Boolean)
      .map((act) => {
        const weightedFreq = PERSONAS.reduce((sum, p) => sum + personaShare[p.id] * (PERSONA_ACTIVITY_FREQUENCY[p.id][act.id] || 1), 0);
        const priorityScore = weightedFreq * act.aiPotential;
        return {
          activity: act,
          freqNum: weightedFreq,
          freq: freqLabel(weightedFreq),
          potential: potentialLabel(act.aiPotential),
          priorityScore,
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);

    // 7. Action plan
    const topPersonaName = personaRanking.find((p) => topPersonaIds[0] === p.id)?.name || 'your top-impact team';
    const topPersonaTarget = roadmap.find((r) => r.persona.id === topPersonaIds[0]);
    const actions = [];
    if (state.policyStatus !== 'yes') {
      actions.push({ title: 'Publish an acceptable-use policy', desc: 'Put a written AI policy in place before wider rollout — start from a free template in the Governance section below.' });
    }
    if (maturity.id <= 1) {
      actions.push({ title: 'Approve a small set of AI tools', desc: 'Pick 1–2 approved platforms per scenario and communicate them org-wide to reduce unmanaged "shadow AI" use.' });
    }
    actions.push({ title: 'Deliver Level 1 AI Aware training to everyone', desc: 'Every employee should complete a short foundations course — see the Level 1 resources in your Capability Roadmap.' });
    if (topPersonaTarget) {
      actions.push({
        title: `Fast-track training for ${topPersonaName}`,
        desc: `This group has your highest combined workforce share and AI impact score — move them toward Level ${topPersonaTarget.targetLevel} (${topPersonaTarget.targetDef.name}) first.`,
      });
    }
    actions.push({ title: 'Set a 90-day adoption checkpoint', desc: 'Re-run this assessment or use a maturity tool like MITRE\'s AI Maturity Model to track movement between levels.' });

    return { maturity, personaRanking, topPersonaIds, roadmap, platforms, governance, activityRows, actions, personaShare };
  }

  /* ================================================================
     REPORT RENDERING
     ================================================================ */

  const iconMap = {
    shield: '<path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
    chart: '<path d="M4 20V10M12 20V4M20 20v-7"/>',
  };

  function fmtPct(n) {
    return Math.round(n * 100) + '%';
  }

  function renderReport(report) {
    const s = state;
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // ---- Sources appendix (dedupe by url) ----
    const seen = new Set();
    const trainingSources = [];
    const platformSources = [];
    const govSources = [];
    report.roadmap.forEach((r) => r.resources.forEach((res) => {
      if (!seen.has(res.url)) { seen.add(res.url); trainingSources.push(res); }
    }));
    report.platforms.forEach((p) => p.tools.forEach((t) => {
      if (!seen.has(t.url)) { seen.add(t.url); platformSources.push(t); }
    }));
    report.governance.forEach((g) => g.resources.forEach((r) => {
      if (!seen.has(r.url)) { seen.add(r.url); govSources.push(r); }
    }));

    const html = `
      <div class="report-header">
        <div class="report-header__top">
          <div>
            <h1>Your AI Capability &amp; Adoption Plan</h1>
            <span class="report-header__date">Generated ${dateStr} · AICAF v${AICAF_VERSION} · Tech Partners LLC</span>
          </div>
          <span class="badge badge--primary">Maturity Level ${report.maturity.id} — ${report.maturity.name}</span>
        </div>
        <div class="snapshot-grid">
          <div class="snapshot-item"><div class="snapshot-item__label">Company size</div><div class="snapshot-item__value">${label(COMPANY_SIZES, s.companySize)}</div></div>
          <div class="snapshot-item"><div class="snapshot-item__label">Industry</div><div class="snapshot-item__value">${label(INDUSTRIES, s.industry)}</div></div>
          <div class="snapshot-item"><div class="snapshot-item__label">Tech environment</div><div class="snapshot-item__value">${label(TECH_ENVIRONMENTS, s.techEnv)}</div></div>
          <div class="snapshot-item"><div class="snapshot-item__label">Top priority</div><div class="snapshot-item__value">${label(PRIORITIES, s.priorities[0])}</div></div>
        </div>
      </div>

      <section class="report-section" id="sec-maturity">
        <div class="report-section__head">
          <div><span class="report-section__num">Pillar 2 — AI Maturity</span><h2>Where you are today</h2></div>
        </div>
        <div class="maturity-card">
          <div class="maturity-card__level">${report.maturity.id}</div>
          <div>
            <h3>${report.maturity.name}</h3>
            <p>${report.maturity.short}</p>
          </div>
        </div>
        <p class="report-section__intro"><strong>Signals at this level:</strong> ${report.maturity.signals.join(' · ')}</p>
      </section>

      <section class="report-section" id="sec-personas">
        <div class="report-section__head">
          <div><span class="report-section__num">Pillar 3 — Workforce AI Relevance</span><h2>Who benefits most from AI at your organization</h2></div>
        </div>
        <p class="report-section__intro">Ranked by workforce share × AI impact score. The top 3 are expanded with the specific work AI can take on.</p>
        <div class="persona-list">
          ${report.personaRanking
            .map((p) => {
              const isPriority = report.topPersonaIds.includes(p.id) && p.share > 0;
              return `
              <div class="persona-bar ${isPriority ? 'is-priority' : ''}">
                <div class="persona-bar__head">
                  <div>
                    <div class="persona-bar__name">${p.name}</div>
                    <div class="persona-bar__examples">${p.examples}</div>
                  </div>
                  <div class="persona-bar__score">${fmtPct(p.share)} of workforce · Impact ${p.impact}/10</div>
                </div>
                <div class="persona-bar__track"><div class="persona-bar__fill" style="width:${Math.min(100, p.share * 100)}%"></div></div>
                ${isPriority ? `
                <div class="persona-bar__detail">
                  <div><strong>Core work</strong>${p.coreWork}</div>
                  <div><strong>Where AI helps</strong>${p.aiValue}</div>
                </div>` : ''}
              </div>`;
            })
            .join('')}
        </div>
      </section>

      <section class="report-section" id="sec-roadmap">
        <div class="report-section__head">
          <div><span class="report-section__num">Pillar 4 — Capability Roadmap</span><h2>Training targets by role</h2></div>
        </div>
        <p class="report-section__intro">"Now" reflects a realistic level given your current org maturity; "Target" is where each role should ultimately land.</p>
        <div class="roadmap-grid">
          ${report.roadmap
            .map(
              (r) => `
            <div class="roadmap-card">
              <div class="roadmap-card__head">
                <h3>${r.persona.name}</h3>
                <span class="badge badge--primary">${fmtPct(r.persona.share)}</span>
              </div>
              <div class="roadmap-levels">
                <span>Now: L${r.nowLevel} ${r.nowDef.name}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                <span>Target: L${r.targetLevel} ${r.targetDef.name}</span>
              </div>
              <ul>${r.targetDef.skills.map((sk) => `<li>${sk}</li>`).join('')}</ul>
              <div class="roadmap-card__resources">
                <p>Training resources</p>
                ${r.resources
                  .map(
                    (res) => `<a class="resource-link" href="${res.url}" target="_blank" rel="noopener">${res.name}<span class="resource-link__meta">${res.provider} · ${res.cost}</span></a>`
                  )
                  .join('')}
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>

      <section class="report-section" id="sec-platforms">
        <div class="report-section__head">
          <div><span class="report-section__num">Pillar 5 — Platform Alignment</span><h2>Tools matched to your scenarios</h2></div>
        </div>
        <p class="report-section__intro">Organized by business scenario, not vendor preference. Cards marked <span class="badge badge--primary">Fits your stack</span> match your current technology environment.</p>
        <div class="platform-grid">
          ${report.platforms
            .map(
              (p) => `
            <div class="platform-card ${p.recommended ? 'is-recommended' : ''}">
              <div class="platform-card__head">
                <h3>${p.label}</h3>
                ${p.recommended ? '<span class="badge badge--primary">Fits your stack</span>' : ''}
              </div>
              ${p.tools
                .map(
                  (t) => `
                <div class="platform-tool">
                  <div class="platform-tool__name"><a href="${t.url}" target="_blank" rel="noopener">${t.name}</a></div>
                  <div class="platform-tool__desc">${t.desc}</div>
                  <div class="platform-tool__meta">${t.price}</div>
                </div>`
                )
                .join('')}
            </div>`
            )
            .join('')}
        </div>
      </section>

      <section class="report-section" id="sec-governance">
        <div class="report-section__head">
          <div><span class="report-section__num">Pillar 6 — Governance &amp; Adoption</span><h2>Your governance checklist</h2></div>
        </div>
        <div class="gov-grid">
          ${report.governance
            .map(
              (g) => `
            <div class="gov-card">
              <div class="gov-card__head">
                <span class="gov-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconMap[g.icon]}</svg></span>
                <h3>${g.label}</h3>
                ${g.flag ? `<span class="badge badge--warning">${g.flag}</span>` : ''}
              </div>
              <ul>${g.checklist.map((c) => `<li>${c}</li>`).join('')}</ul>
              <div class="gov-card__resources">
                ${g.resources.map((r) => `<a class="resource-link" href="${r.url}" target="_blank" rel="noopener">${r.name}<span class="resource-link__meta">${r.org} · ${r.cost}</span></a>`).join('')}
              </div>
            </div>`
            )
            .join('')}
        </div>
      </section>

      <section class="report-section" id="sec-activities">
        <div class="report-section__head">
          <div><span class="report-section__num">Pillar 7 — The Missing Piece</span><h2>Business activity priorities</h2></div>
        </div>
        <p class="report-section__intro">Every role performs some mix of these activities. Frequency is weighted by your workforce composition; AI potential is activity-specific.</p>
        <div class="activity-table-wrap">
          <table class="activity-table">
            <thead><tr><th>Activity</th><th>Frequency in your org</th><th>AI potential</th><th>Priority</th></tr></thead>
            <tbody>
              ${report.activityRows
                .map(
                  (row, i) => `
                <tr>
                  <td><strong>${row.activity.label}</strong><br><span style="color:var(--color-text-faint);font-size:var(--text-xs);">${row.activity.desc}</span></td>
                  <td>${row.freq}</td>
                  <td>${row.potential}</td>
                  <td><span class="badge ${i === 0 ? 'badge--primary' : ''}">${i < 2 ? 'High' : i < 4 ? 'Medium' : 'Later'}</span></td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="report-section" id="sec-actions">
        <div class="report-section__head">
          <div><span class="report-section__num">Action Plan</span><h2>What to do next</h2></div>
        </div>
        <div class="action-list">
          ${report.actions
            .map(
              (a, i) => `
            <div class="action-item">
              <span class="action-item__num">${i + 1}</span>
              <div><h4>${a.title}</h4><p>${a.desc}</p></div>
            </div>`
            )
            .join('')}
        </div>
      </section>

      <section class="report-section" id="sec-sources">
        <div class="report-section__head">
          <div><span class="report-section__num">Sources</span><h2>Sources &amp; further reading</h2></div>
        </div>
        <div class="sources-cols">
          <div>
            <h4>Training resources</h4>
            <ol>${trainingSources.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener">${r.name}</a> — ${r.provider}</li>`).join('')}</ol>
          </div>
          <div>
            <h4>Platforms &amp; tools</h4>
            <ol>${platformSources.map((t) => `<li><a href="${t.url}" target="_blank" rel="noopener">${t.name}</a> — ${t.vendor}</li>`).join('')}</ol>
          </div>
          <div>
            <h4>Governance &amp; policy</h4>
            <ol>${govSources.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener">${r.name}</a> — ${r.org}</li>`).join('')}</ol>
          </div>
        </div>
        <p class="report-disclaimer">This plan reflects general guidance based on the resources cited above and is not legal, compliance, or professional advice. Pricing, course availability, and policy requirements change — confirm current details with each provider, and consult qualified legal counsel before adopting a governance policy in a regulated industry.</p>
      </section>

      <section class="report-section no-print" id="sec-followup">
        <div class="followup">
          <h2>Want help putting this plan into action?</h2>
          <p>Tech Partners LLC helps Oklahoma-area businesses turn plans like this into rollout, training, and hiring support. Fill in your details and we'll email you a copy along with next steps.</p>
          <div class="followup__fields">
            <div class="field"><label for="lead-name-2">Name</label><input type="text" id="lead-name-2" placeholder="Jane Smith" /></div>
            <div class="field"><label for="lead-org-2">Organization</label><input type="text" id="lead-org-2" placeholder="Acme Co." /></div>
            <div class="field"><label for="lead-email-2">Email</label><input type="email" id="lead-email-2" placeholder="jane@acme.com" /></div>
          </div>
          <div class="followup__actions">
            <button class="btn btn-primary" id="email-plan-btn" type="button">Email me this plan</button>
          </div>
        </div>
        <div class="restart-row">
          <button class="btn btn-ghost" id="restart-btn" type="button">Start a new assessment</button>
        </div>
      </section>
    `;

    document.getElementById('report').innerHTML = html;

    // wire up followup fields (pre-fill from step-5 lead box if present)
    document.getElementById('lead-name-2').value = state.lead.name;
    document.getElementById('lead-org-2').value = state.lead.org;
    document.getElementById('lead-email-2').value = state.lead.email;
    document.getElementById('lead-name-2').addEventListener('input', (e) => (state.lead.name = e.target.value));
    document.getElementById('lead-org-2').addEventListener('input', (e) => (state.lead.org = e.target.value));
    document.getElementById('lead-email-2').addEventListener('input', (e) => (state.lead.email = e.target.value));

    document.getElementById('email-plan-btn').addEventListener('click', () => sendPlanEmail(report));
    document.getElementById('restart-btn').addEventListener('click', restartAssessment);
  }

  function sendPlanEmail(report) {
    if (!state.lead.email) {
      showToast('Add your email first');
      return;
    }
    trackEvent('lead_captured', { has_org: Boolean(state.lead.org) });
    const subject = `AICAF plan request — ${state.lead.org || state.lead.name || 'New lead'}`;
    const bodyLines = [
      `Name: ${state.lead.name || 'n/a'}`,
      `Organization: ${state.lead.org || 'n/a'}`,
      `Email: ${state.lead.email}`,
      '',
      `Company size: ${label(COMPANY_SIZES, state.companySize)}`,
      `Industry: ${label(INDUSTRIES, state.industry)}`,
      `Tech environment: ${label(TECH_ENVIRONMENTS, state.techEnv)}`,
      `AI maturity: Level ${report.maturity.id} — ${report.maturity.name}`,
      `Top priorities: ${state.priorities.map((p) => label(PRIORITIES, p)).join(', ')}`,
      `Top persona: ${report.personaRanking[0].name}`,
      '',
      'Requesting a follow-up on my AICAF plan generated at this tool.',
    ];
    const mailto = `mailto:doug.halve@techpartnersllc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;
  }

  function restartAssessment() {
    document.getElementById('results').classList.remove('is-visible');
    document.getElementById('intro').classList.remove('hidden');
    document.getElementById('wizard').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- Generate ---------------- */
  generateBtn.addEventListener('click', () => {
    const report = computeReport();
    renderReport(report);
    document.getElementById('wizard').classList.add('hidden');
    const resultsEl = document.getElementById('results');
    resultsEl.classList.add('is-visible');
    trackEvent('report_generated', {
      company_size: state.companySize,
      industry: state.industry,
      maturity_level: state.maturity,
    });
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------------- Print / PDF ---------------- */
  document.getElementById('print-btn').addEventListener('click', () => {
    trackEvent('report_print_clicked');
    window.print();
  });

  document.getElementById('pdf-btn').addEventListener('click', () => {
    trackEvent('report_pdf_download_clicked');
    const el = document.getElementById('report');
    document.body.classList.add('pdf-mode');
    const opt = {
      margin: 0.4,
      filename: 'AICAF-AI-Training-Plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    showToast('Preparing your PDF…');
    const cleanup = () => {
      document.body.classList.remove('pdf-mode');
      document.querySelectorAll('.html2pdf__overlay').forEach((n) => n.remove());
    };
    // html2canvas re-fetches external font stylesheets (Google Fonts, Fontshare) while
    // cloning the document. If a font CDN is slow, blocked (ad blocker, corporate
    // firewall), or briefly down, that fetch can hang indefinitely with no error event,
    // leaving the button stuck forever. Race against a hard timeout so users always get
    // feedback and a working fallback.
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('pdf-timeout')), 20000)
    );
    Promise.race([html2pdf().set(opt).from(el).save(), timeout])
      .then(cleanup)
      .catch(() => {
        cleanup();
        showToast('PDF export is taking too long — try Print instead');
      });
  });
})();
