:root {
  --ink: #0F1B2D;
  --ink-2: #16263E;
  --paper: #F5F1E6;
  --paper-line: #E4DEC9;
  --gold: #C9A227;
  --gold-dim: #8A7325;
  --sage: #4F7965;
  --rust: #B5533C;
  --ink-light: #8B93A1;
  --text-dark: #23201B;
  --font-display: Georgia, "Iowan Old Style", "Palatino Linotype", serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "IBM Plex Mono", Menlo, Consolas, monospace;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  height: 100%;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-body);
  -webkit-tap-highlight-color: transparent;
}

body { padding-bottom: env(safe-area-inset-bottom); }

.hidden { display: none !important; }
.hidden-file { display: none; }

button { font-family: inherit; cursor: pointer; border: none; }
input, select { font-family: inherit; }

@media (prefers-reduced-motion: no-preference) {
  .btn-primary, .btn-secondary, .btn-ghost, .btn-danger, .tab-btn {
    transition: transform 0.12s ease, background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  }
  .btn-primary:active, .btn-secondary:active, .btn-danger:active { transform: scale(0.96); }
  .tab-btn:active { transform: scale(0.93); }
}
.btn-primary, .btn-secondary { box-shadow: 0 2px 10px rgba(0,0,0,0.18); }
.btn-primary:active, .btn-secondary:active { box-shadow: 0 1px 4px rgba(0,0,0,0.18); }

/* ---------- Setup ---------- */
.setup-wrap {
  max-width: 420px;
  margin: 0 auto;
  padding: 48px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.stamp-mark {
  width: 56px; height: 56px;
  border: 2px solid var(--gold);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--gold);
  margin-bottom: 6px;
}
.setup-wrap h1 {
  font-family: var(--font-display);
  font-size: 28px;
  margin: 0 0 2px;
  color: var(--paper);
}
.setup-wrap .sub {
  color: var(--ink-light);
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.5;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--ink-light);
}
input, select {
  background: var(--ink-2);
  border: 1px solid #2B3B54;
  color: var(--paper);
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 16px;
}
input:focus, select:focus {
  outline: 2px solid var(--gold-dim);
  outline-offset: 1px;
}

.btn-primary, .btn-secondary, .btn-ghost, .btn-danger {
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 4px;
}
.btn-primary { background: var(--gold); color: var(--ink); }
.btn-primary:active { background: var(--gold-dim); }
.btn-secondary { background: var(--ink-2); color: var(--paper); border: 1px solid #2B3B54; }
.btn-ghost { background: transparent; color: var(--ink-light); font-weight: 500; }
.btn-danger { background: var(--rust); color: var(--paper); }

/* ---------- App shell ---------- */
.view { min-height: 100vh; }
#view-app { display: flex; flex-direction: column; min-height: 100vh; }
.tab { flex: 1; padding: 20px 18px 100px; max-width: 480px; margin: 0 auto; width: 100%; }

@media (prefers-reduced-motion: no-preference) {
  .tab:not(.hidden) { animation: tabIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
  .tab:not(.hidden) > *:not(.tabbar) { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .tab:not(.hidden) > *:nth-child(1) { animation-delay: 0.02s; }
  .tab:not(.hidden) > *:nth-child(2) { animation-delay: 0.07s; }
  .tab:not(.hidden) > *:nth-child(3) { animation-delay: 0.12s; }
  .tab:not(.hidden) > *:nth-child(4) { animation-delay: 0.17s; }
  .tab:not(.hidden) > *:nth-child(5) { animation-delay: 0.22s; }
}
@keyframes tabIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.topbar { padding: 8px 0 18px; }
.topbar h2 { font-family: var(--font-display); font-size: 24px; margin: 0; }
.eyebrow {
  font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--gold); font-weight: 600;
}
.date-line { font-family: var(--font-display); font-size: 22px; margin-top: 2px; }

/* Stamp (signature element) */
.stamp-card {
  display: flex; flex-direction: column; align-items: center;
  padding: 28px 0 16px;
}
.ring-wrap {
  width: 210px; height: 210px;
  position: relative;
  display: flex; align-items: center; justify-content: center;
  animation: ringAppear 0.6s cubic-bezier(0.16,1,0.3,1) both;
}
.ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-track {
  fill: none; stroke: rgba(201,162,39,0.14); stroke-width: 9;
}
.ring-progress {
  fill: none; stroke: var(--gold); stroke-width: 9; stroke-linecap: round;
  stroke-dasharray: 552.9;
  stroke-dashoffset: 552.9;
  transition: stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1), stroke 0.4s ease;
  filter: drop-shadow(0 0 6px rgba(201,162,39,0.35));
}
.ring-wrap.over .ring-progress { stroke: var(--rust); filter: drop-shadow(0 0 6px rgba(181,83,60,0.4)); }
.stamp-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.stamp-amount {
  font-family: var(--font-mono);
  font-size: 36px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  transition: color 0.4s ease;
}
.stamp-label { font-size: 12px; color: var(--ink-light); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
.stamp-foot { margin-top: 14px; font-size: 13px; color: var(--ink-light); font-family: var(--font-mono); }

@keyframes ringAppear {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes pulseOver {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(181,83,60,0.4)); }
  50% { filter: drop-shadow(0 0 14px rgba(181,83,60,0.7)); }
}
.ring-wrap.over .ring-progress { animation: pulseOver 1.8s ease-in-out infinite; }

/* Ledger cards */
.ledger-card {
  background: var(--paper);
  color: var(--text-dark);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 16px;
}
.ledger-card.danger { border: 1px solid var(--rust); }
.ledger-row-head {
  font-family: var(--font-display);
  font-size: 15px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--paper-line);
  display: flex; justify-content: space-between; align-items: baseline;
}
.sub-range { font-size: 11px; color: #8a8370; font-family: var(--font-body); font-weight: 400; }

.week-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 10px;
}
.wc-label { font-size: 11px; color: #8a8370; text-transform: uppercase; letter-spacing: 0.05em; }
.wc-value { font-family: var(--font-mono); font-size: 18px; font-weight: 600; margin-top: 3px; transition: color 0.3s ease; }
.sage { color: var(--sage); }
.rust { color: var(--rust); }

.progress-track {
  height: 6px; background: var(--paper-line); border-radius: 3px; margin-top: 16px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: var(--gold); width: 0%;
  transition: width 0.8s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease;
  position: relative;
}
.progress-fill::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  animation: shimmer 2s ease-in-out infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.week-formula {
  font-size: 11px; color: #a39c88; margin-top: 10px; font-family: var(--font-mono);
}

.quick-actions { display: flex; gap: 10px; margin-bottom: 16px; }
.quick-actions button { flex: 1; }

.tx-list { display: flex; flex-direction: column; gap: 10px; }
.tx-list.full { padding: 0 0 20px; }
.tx-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0; border-bottom: 1px solid var(--paper-line);
  animation: rowIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
}
.tx-row:nth-child(1) { animation-delay: 0.03s; }
.tx-row:nth-child(2) { animation-delay: 0.07s; }
.tx-row:nth-child(3) { animation-delay: 0.11s; }
.tx-row:nth-child(4) { animation-delay: 0.15s; }
.tx-row:nth-child(5) { animation-delay: 0.19s; }
.tx-row:nth-child(6) { animation-delay: 0.23s; }
@keyframes rowIn {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
}
.tx-row:last-child { border-bottom: none; padding-bottom: 0; }
.tx-main { display: flex; flex-direction: column; }
.tx-cat { font-size: 13px; font-weight: 600; }
.tx-note { font-size: 12px; color: #8a8370; }
.tx-date { font-size: 11px; color: #a39c88; margin-top: 1px; }
.tx-amount { font-family: var(--font-mono); font-weight: 600; font-size: 15px; }
.tx-amount.income { color: var(--sage); }
.tx-amount.expense { color: var(--rust); }
.tx-empty { color: #a39c88; font-size: 13px; text-align: center; padding: 12px 0; }

.filter-row { margin-bottom: 14px; }
.filter-row select { width: 100%; background: var(--ink-2); color: var(--paper); border: 1px solid #2B3B54; padding: 10px 12px; border-radius: 10px; }

/* Donut chart via conic-gradient */
.donut-wrap { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.donut {
  width: 130px; height: 130px; border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}
.donut::after {
  content: "";
  position: absolute; inset: 22px;
  background: var(--paper); border-radius: 50%;
}
.donut-legend { flex: 1; min-width: 140px; display: flex; flex-direction: column; gap: 8px; }
.legend-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.legend-row .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-row .amt { margin-left: auto; font-family: var(--font-mono); font-weight: 600; }
.legend-empty { color: #a39c88; font-size: 13px; }

.trend-svg { width: 100%; height: auto; }
.trend-legend { display: flex; gap: 16px; font-size: 12px; color: #8a8370; margin-top: 6px; }
.trend-legend .dot { width: 9px; height: 9px; border-radius: 2px; display: inline-block; margin-right: 5px; }

/* Settings */
#tab-settings .ledger-card label { margin-bottom: 12px; }
#tab-settings input, #tab-settings select {
  background: #fff; color: var(--text-dark); border: 1px solid var(--paper-line);
}
.cat-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.cat-row { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.cat-row .dot { width: 12px; height: 12px; border-radius: 50%; }
.cat-row .cat-remove { margin-left: auto; background: none; color: var(--rust); font-size: 12px; padding: 4px 8px; }
.add-cat-row { display: flex; gap: 8px; }
.add-cat-row input {
  flex: 1; background: #fff; color: var(--text-dark); border: 1px solid var(--paper-line);
  padding: 10px 12px; border-radius: 8px;
}
#btn-export, #btn-import { width: 100%; margin-top: 8px; }
#btn-export:first-of-type { margin-top: 0; }

/* Tab bar */
.tabbar {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex;
  background: var(--ink-2);
  border-top: 1px solid #223047;
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
  max-width: 480px; margin: 0 auto;
}
.tab-btn {
  flex: 1; background: transparent; color: var(--ink-light);
  padding: 10px 4px; font-size: 12px; border-radius: 10px;
}
.tab-btn.active { color: var(--gold); background: rgba(201,162,39,0.08); }

/* Modal */
.modal {
  position: fixed; inset: 0; background: rgba(15,27,45,0.7);
  backdrop-filter: blur(3px);
  display: flex; align-items: flex-end; justify-content: center; z-index: 50;
  animation: fadeIn 0.25s ease both;
}
.modal-card {
  background: var(--paper); color: var(--text-dark);
  width: 100%; max-width: 480px;
  border-radius: 18px 18px 0 0;
  padding: 22px 20px calc(22px + env(safe-area-inset-bottom));
  display: flex; flex-direction: column; gap: 12px;
  animation: sheetUp 0.35s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes sheetUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-card input, .modal-card select {
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.modal-card input:focus, .modal-card select:focus {
  border-color: var(--gold-dim); box-shadow: 0 0 0 3px rgba(201,162,39,0.15); outline: none;
}
.modal-title { font-family: var(--font-display); font-size: 19px; }
.modal-card label { color: #8a8370; }
.modal-card input, .modal-card select {
  background: #fff; color: var(--text-dark); border: 1px solid var(--paper-line);
}
.modal-actions { display: flex; gap: 10px; margin-top: 6px; }
.modal-actions button { flex: 1; }

.toast {
  position: fixed; bottom: 90px; left: 50%;
  background: var(--ink-2); color: var(--paper); padding: 10px 18px;
  border-radius: 20px; font-size: 13px; z-index: 60;
  border: 1px solid var(--gold-dim);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes toastIn {
  from { transform: translate(-50%, 12px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.confetti-piece {
  position: fixed; z-index: 70; border-radius: 2px; pointer-events: none;
  animation: confettiFall 0.9s ease-out forwards;
}
@keyframes confettiFall {
  from { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  to { transform: var(--fall-transform); opacity: 0; }
}

@media (min-width: 480px) {
  .tabbar { border-radius: 14px 14px 0 0; }
}
