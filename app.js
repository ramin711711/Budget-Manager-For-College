// ---------- Storage ----------
const DB = {
  configKey: "ledger:config",
  txKey: "ledger:transactions",
  catKey: "ledger:categories",

  getConfig() { return JSON.parse(localStorage.getItem(this.configKey) || "null"); },
  setConfig(c) { localStorage.setItem(this.configKey, JSON.stringify(c)); },

  getTx() { return JSON.parse(localStorage.getItem(this.txKey) || "[]"); },
  setTx(list) { localStorage.setItem(this.txKey, JSON.stringify(list)); },

  getCats() { return JSON.parse(localStorage.getItem(this.catKey) || "null"); },
  setCats(list) { localStorage.setItem(this.catKey, JSON.stringify(list)); },

  exportAll() {
    return JSON.stringify({
      config: this.getConfig(),
      transactions: this.getTx(),
      categories: this.getCats(),
      exportedAt: new Date().toISOString(),
      version: 1
    }, null, 2);
  },
  importAll(json) {
    const data = JSON.parse(json);
    if (!data.config || !data.transactions) throw new Error("Not a valid backup file");
    this.setConfig(data.config);
    this.setTx(data.transactions);
    this.setCats(data.categories || DEFAULT_CATS);
  },
  wipe() {
    localStorage.removeItem(this.configKey);
    localStorage.removeItem(this.txKey);
    localStorage.removeItem(this.catKey);
  }
};

const DEFAULT_CATS = [
  { name: "Food", color: "#C9A227" },
  { name: "Transport", color: "#4F7965" },
  { name: "Subscriptions", color: "#8E6FB0" },
  { name: "Social", color: "#B5533C" },
  { name: "School", color: "#3E7CB1" },
  { name: "Misc", color: "#8B93A1" }
];

// ---------- Date helpers ----------
function toDateOnly(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function todayStr() { return toDateOnly(new Date()).toISOString().slice(0,10); }
function dayDiff(a, b) { return Math.round((toDateOnly(a) - toDateOnly(b)) / 86400000); }
function addDays(d, n) { const x = toDateOnly(d); x.setDate(x.getDate() + n); return x; }
function fmtDate(d) { return toDateOnly(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }

function weekStartFor(date, weekStartDay) {
  const d = toDateOnly(date);
  const diff = (d.getDay() - weekStartDay + 7) % 7;
  return addDays(d, -diff);
}

// ---------- Derived config ----------
function deriveConfig(cfg) {
  const start = toDateOnly(cfg.startDate);
  const end = addDays(start, cfg.durationDays - 1);
  const daily = cfg.totalBudget / cfg.durationDays;
  return { ...cfg, start, end, daily };
}

function money(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toFixed(2);
}

// ---------- Animation helpers ----------
function parseMoneyText(s) {
  const n = parseFloat(String(s).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

function animateNumber(el, toValue, opts = {}) {
  const fromValue = parseMoneyText(el.textContent);
  const duration = opts.duration || 550;
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const current = fromValue + (toValue - fromValue) * eased;
    el.textContent = money(current);
    if (opts.colorize) {
      el.style.color = current < 0 ? "var(--rust)" : "";
    }
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = money(toValue);
  }
  requestAnimationFrame(tick);
}

const CIRCUMFERENCE = 2 * Math.PI * 88;
function setRing(pct, isOver) {
  const ring = document.getElementById("ring-progress");
  const wrap = document.getElementById("ring-wrap");
  const clamped = Math.max(0, Math.min(1, pct));
  const offset = CIRCUMFERENCE * (1 - clamped);
  ring.style.strokeDashoffset = offset;
  wrap.classList.toggle("over", isOver);
}

function vibrate(ms) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {}
}

function burstConfetti(x, y) {
  const colors = ["#C9A227", "#4F7965", "#B5533C", "#F5F1E6"];
  const count = 14;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const size = 4 + Math.random() * 5;
    piece.style.width = size + "px";
    piece.style.height = size + "px";
    piece.style.left = x + "px";
    piece.style.top = y + "px";
    piece.style.background = colors[i % colors.length];
    const angle = (Math.random() * Math.PI) - Math.PI / 2 - Math.PI / 2;
    const dist = 40 + Math.random() * 70;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;
    piece.style.setProperty("--fall-transform", `translate(${dx}px, ${dy + 90}px) rotate(${(Math.random()*360)|0}deg)`);
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 950);
  }
}

// ---------- App state ----------
let cfg = null;
let cats = [];
let txs = [];

function loadState() {
  const raw = DB.getConfig();
  cfg = raw ? deriveConfig(raw) : null;
  cats = DB.getCats() || DEFAULT_CATS;
  txs = DB.getTx();
}

// ---------- Computations ----------
function netForRange(fromDate, toDateIncl) {
  const from = toDateOnly(fromDate), to = toDateOnly(toDateIncl);
  let spent = 0, income = 0;
  for (const t of txs) {
    const d = toDateOnly(t.date);
    if (d >= from && d <= to) {
      if (t.type === "expense") spent += t.amount;
      else income += t.amount;
    }
  }
  return { spent, income, net: spent - income };
}

function weekStats(weekStartDate) {
  const start = toDateOnly(weekStartDate);
  const end = addDays(start, 6);
  const today = toDateOnly(new Date());
  const cappedEnd = end > today ? today : end;
  const daysElapsed = Math.max(0, dayDiff(cappedEnd, start) + 1);
  const allotted = cfg.daily * daysElapsed;
  const { spent, income } = netForRange(start, end);
  const saved = allotted - (spent - income);
  return { start, end, allotted, spent, income, saved };
}

function todayStats() {
  const today = toDateOnly(new Date());
  const { spent, income } = netForRange(today, today);
  const remaining = cfg.daily - (spent - income);
  return { remaining, spent, income };
}

// ---------- Rendering: Today ----------
function renderToday() {
  const today = toDateOnly(new Date());
  const dayNum = Math.min(cfg.durationDays, Math.max(1, dayDiff(today, cfg.start) + 1));
  document.getElementById("today-daynum").textContent = `Day ${dayNum} of ${cfg.durationDays}`;
  document.getElementById("today-date").textContent = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const ts = todayStats();
  const remEl = document.getElementById("stamp-remaining");
  animateNumber(remEl, ts.remaining, { duration: 600 });
  remEl.style.color = ts.remaining < 0 ? "var(--rust)" : "var(--paper)";
  document.getElementById("stamp-allowance").textContent = `of ${money(cfg.daily)} / day`;
  setRing(cfg.daily > 0 ? ts.remaining / cfg.daily : 0, ts.remaining < 0);

  const wStart = weekStartFor(today, cfg.weekStartDay);
  const ws = weekStats(wStart);
  animateNumber(document.getElementById("week-allotted"), ws.allotted);
  animateNumber(document.getElementById("week-spent"), ws.spent);
  animateNumber(document.getElementById("week-income"), ws.income);
  animateNumber(document.getElementById("week-saved"), ws.saved);
  document.getElementById("week-saved").className = "wc-value " + (ws.saved < 0 ? "rust" : "sage");
  document.getElementById("week-formula").textContent =
    `${money(ws.allotted)} allotted − ${money(ws.spent)} spent + ${money(ws.income)} income = ${money(ws.saved)} saved`;
  const pct = ws.allotted > 0 ? Math.min(100, Math.max(0, ((ws.spent - ws.income) / ws.allotted) * 100)) : 0;
  const fill = document.getElementById("week-progress");
  requestAnimationFrame(() => { fill.style.width = pct + "%"; });
  fill.style.background = pct > 90 ? "var(--rust)" : "var(--gold)";

  renderTxList(document.getElementById("recent-list"), txs.slice().sort((a,b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 6));
}

function catColor(name) {
  const c = cats.find(c => c.name === name);
  return c ? c.color : "#8B93A1";
}

function renderTxList(container, list) {
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = `<div class="tx-empty">Nothing here yet.</div>`;
    return;
  }
  for (const t of list) {
    const row = document.createElement("div");
    row.className = "tx-row";
    row.innerHTML = `
      <div class="tx-main">
        <span class="tx-cat">${t.type === "income" ? "Income" : t.category}</span>
        ${t.note ? `<span class="tx-note">${escapeHtml(t.note)}</span>` : ""}
        <span class="tx-date">${fmtDate(t.date)}</span>
      </div>
      <div class="tx-amount ${t.type}">${t.type === "income" ? "+" : "-"}${money(t.amount).replace("$","$")}</div>
    `;
    container.appendChild(row);
  }
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

// ---------- Rendering: History ----------
function renderHistory() {
  const sel = document.getElementById("hist-filter");
  const current = sel.value;
  sel.innerHTML = `<option value="all">All categories</option>` +
    cats.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join("") +
    `<option value="income">Income</option>`;
  sel.value = current || "all";

  const filter = sel.value;
  let list = txs.slice().sort((a,b) => b.date.localeCompare(a.date) || b.id - a.id);
  if (filter === "income") list = list.filter(t => t.type === "income");
  else if (filter !== "all") list = list.filter(t => t.category === filter);

  renderTxList(document.getElementById("history-list"), list);
}

// ---------- Rendering: Stats ----------
function renderStats() {
  const now = toDateOnly(new Date());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const byCat = {};
  for (const t of txs) {
    if (t.type !== "expense") continue;
    const d = toDateOnly(t.date);
    if (d < monthStart || d > now) continue;
    byCat[t.category] = (byCat[t.category] || 0) + t.amount;
  }
  const entries = Object.entries(byCat).sort((a,b) => b[1]-a[1]);
  const total = entries.reduce((s,[,v]) => s+v, 0);

  const donut = document.getElementById("donut");
  const legend = document.getElementById("donut-legend");
  if (total === 0) {
    donut.style.background = "#3a4256";
    legend.innerHTML = `<div class="legend-empty">No expenses logged this month yet.</div>`;
  } else {
    let acc = 0;
    const stops = entries.map(([name, val]) => {
      const startPct = (acc/total)*100;
      acc += val;
      const endPct = (acc/total)*100;
      return `${catColor(name)} ${startPct}% ${endPct}%`;
    });
    donut.style.background = `conic-gradient(${stops.join(",")})`;
    legend.innerHTML = entries.map(([name,val]) => `
      <div class="legend-row">
        <span class="dot" style="background:${catColor(name)}"></span>
        <span>${escapeHtml(name)}</span>
        <span class="amt">${money(val)}</span>
      </div>
    `).join("");
  }

  renderTrend();
}

function renderTrend() {
  const svg = document.getElementById("trend-chart");
  const weeks = [];
  let cursor = weekStartFor(new Date(), cfg.weekStartDay);
  for (let i = 0; i < 8; i++) {
    weeks.unshift(weekStats(cursor));
    cursor = addDays(cursor, -7);
  }
  const maxVal = Math.max(1, ...weeks.map(w => Math.max(w.spent, Math.abs(w.saved), w.allotted)));
  const chartW = 320, chartH = 160, padB = 20, padT = 10;
  const barW = chartW / weeks.length;
  let bars = "";
  weeks.forEach((w, i) => {
    const x = i * barW;
    const spentH = (w.spent / maxVal) * (chartH - padB - padT);
    const savedH = (Math.max(0,w.saved) / maxVal) * (chartH - padB - padT);
    bars += `<rect x="${x+barW*0.15}" y="${chartH-padB-spentH}" width="${barW*0.3}" height="${spentH}" fill="#B5533C" rx="2"/>`;
    bars += `<rect x="${x+barW*0.55}" y="${chartH-padB-savedH}" width="${barW*0.3}" height="${savedH}" fill="#4F7965" rx="2"/>`;
  });
  svg.innerHTML = `<line x1="0" y1="${chartH-padB}" x2="${chartW}" y2="${chartH-padB}" stroke="#d8d2bd" stroke-width="1"/>` + bars;
  svg.style.background = "var(--paper)";
  svg.style.borderRadius = "10px";
}

// ---------- Rendering: Settings ----------
function renderSettings() {
  const raw = DB.getConfig();
  document.getElementById("set-total").value = raw.totalBudget;
  document.getElementById("set-start").value = raw.startDate;
  document.getElementById("set-months").value = raw.months;
  document.getElementById("set-weekstart").value = raw.weekStartDay;

  const catList = document.getElementById("cat-list");
  catList.innerHTML = cats.map((c, i) => `
    <div class="cat-row">
      <span class="dot" style="background:${c.color}"></span>
      <span>${escapeHtml(c.name)}</span>
      <button class="cat-remove" data-idx="${i}">Remove</button>
    </div>
  `).join("");
  catList.querySelectorAll(".cat-remove").forEach(btn => {
    btn.onclick = () => {
      cats.splice(Number(btn.dataset.idx), 1);
      DB.setCats(cats);
      renderSettings();
    };
  });
}

const PALETTE = ["#C9A227","#4F7965","#8E6FB0","#B5533C","#3E7CB1","#8B93A1","#D98544","#5E8C61"];

// ---------- Navigation ----------
function showTab(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById("tab-" + name).classList.remove("hidden");
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
  if (name === "today") renderToday();
  if (name === "history") renderHistory();
  if (name === "stats") renderStats();
  if (name === "settings") renderSettings();
}

function refreshAll() {
  renderToday();
}

// ---------- Modal ----------
let modalType = "expense";
function openTxModal(type) {
  modalType = type;
  document.getElementById("modal-tx-title").textContent = type === "expense" ? "Add expense" : "Add income";
  document.getElementById("tx-cat-wrap").classList.toggle("hidden", type === "income");
  const catSel = document.getElementById("tx-category");
  catSel.innerHTML = cats.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join("");
  document.getElementById("tx-amount").value = "";
  document.getElementById("tx-note").value = "";
  document.getElementById("tx-date").value = todayStr();
  document.getElementById("modal-tx").classList.remove("hidden");
  document.getElementById("tx-amount").focus();
}
function closeTxModal() { document.getElementById("modal-tx").classList.add("hidden"); }

function saveTx() {
  const amount = parseFloat(document.getElementById("tx-amount").value);
  if (!amount || amount <= 0) { toast("Enter an amount greater than 0"); return; }
  const date = document.getElementById("tx-date").value || todayStr();
  const note = document.getElementById("tx-note").value.trim();
  const tx = {
    id: Date.now(),
    type: modalType,
    amount,
    date,
    note,
    category: modalType === "expense" ? document.getElementById("tx-category").value : null
  };
  txs.push(tx);
  DB.setTx(txs);
  vibrate(modalType === "expense" ? 12 : [10, 30, 10]);
  const saveBtnRect = document.getElementById(modalType === "expense" ? "btn-add-expense" : "btn-add-income").getBoundingClientRect();
  closeTxModal();
  showTab("today");
  burstConfetti(saveBtnRect.left + saveBtnRect.width / 2, saveBtnRect.top);
  toast(modalType === "expense" ? "Expense added" : "Income added");
}

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2200);
}

// ---------- Setup flow ----------
function saveSetupFromForm(totalId, startId, monthsId, weekId) {
  const totalBudget = parseFloat(document.getElementById(totalId).value);
  const startDate = document.getElementById(startId).value;
  const months = parseInt(document.getElementById(monthsId).value, 10);
  const weekStartDay = parseInt(document.getElementById(weekId).value, 10);
  if (!totalBudget || totalBudget <= 0) { toast("Enter your total budget"); return null; }
  if (!startDate) { toast("Pick a start date"); return null; }
  if (!months || months <= 0) { toast("Enter how many months it covers"); return null; }
  const durationDays = Math.round(months * 30.4375);
  const raw = { totalBudget, startDate, months, durationDays, weekStartDay };
  DB.setConfig(raw);
  if (!DB.getCats()) DB.setCats(DEFAULT_CATS);
  return raw;
}

function boot() {
  loadState();
  if (!cfg) {
    document.getElementById("in-start").value = todayStr();
    document.getElementById("view-setup").classList.remove("hidden");
  } else {
    document.getElementById("view-app").classList.remove("hidden");
    showTab("today");
  }
  wireEvents();
  registerSW();
}

function wireEvents() {
  document.getElementById("btn-setup-save").onclick = () => {
    const raw = saveSetupFromForm("in-total","in-start","in-months","in-weekstart");
    if (!raw) return;
    loadState();
    document.getElementById("view-setup").classList.add("hidden");
    document.getElementById("view-app").classList.remove("hidden");
    showTab("today");
  };

  document.getElementById("btn-setup-import").onclick = () => document.getElementById("file-import-setup").click();
  document.getElementById("file-import-setup").onchange = (e) => handleImportFile(e, true);

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => { vibrate(6); showTab(btn.dataset.tab); };
  });

  document.getElementById("btn-add-expense").onclick = () => openTxModal("expense");
  document.getElementById("btn-add-income").onclick = () => openTxModal("income");
  document.getElementById("btn-tx-cancel").onclick = closeTxModal;
  document.getElementById("btn-tx-save").onclick = saveTx;

  document.getElementById("hist-filter").onchange = renderHistory;

  document.getElementById("btn-settings-save").onclick = () => {
    const raw = saveSetupFromForm("set-total","set-start","set-months","set-weekstart");
    if (!raw) return;
    loadState();
    toast("Settings saved");
    showTab("today");
  };

  document.getElementById("btn-add-cat").onclick = () => {
    const input = document.getElementById("new-cat-name");
    const name = input.value.trim();
    if (!name) return;
    if (cats.some(c => c.name.toLowerCase() === name.toLowerCase())) { toast("Category already exists"); return; }
    cats.push({ name, color: PALETTE[cats.length % PALETTE.length] });
    DB.setCats(cats);
    input.value = "";
    renderSettings();
  };

  document.getElementById("btn-export").onclick = () => {
    const blob = new Blob([DB.exportAll()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledger-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById("btn-import").onclick = () => document.getElementById("file-import").click();
  document.getElementById("file-import").onchange = (e) => handleImportFile(e, false);

  document.getElementById("btn-reset").onclick = () => {
    if (confirm("This will erase all data on this device. Continue?")) {
      DB.wipe();
      location.reload();
    }
  };

  document.getElementById("modal-tx").addEventListener("click", (e) => {
    if (e.target.id === "modal-tx") closeTxModal();
  });
}

function handleImportFile(e, fromSetup) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      DB.importAll(reader.result);
      loadState();
      if (fromSetup) {
        document.getElementById("view-setup").classList.add("hidden");
        document.getElementById("view-app").classList.remove("hidden");
      }
      showTab("today");
      toast("Backup restored");
    } catch (err) {
      toast("Couldn't read that file");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

boot();
