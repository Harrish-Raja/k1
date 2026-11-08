// Builds the downloadable project overview PDF.
// 1) Renders docs-pdf/overview.html from the same content the website uses (src/data.js)
// 2) Prints it to public/BreachWatch-AI-Project-Overview.pdf with headless Microsoft Edge / Chrome
// Usage: node scripts/build-pdf.mjs
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  STORY, WALKTHROUGH, PROCEDURES, DEFECTS, DATASETS, MODELS, ATTACK_TYPES, DOCS16,
  NODES, DECISIONS, ROLES, AREAS, TREE, ENTRY_POINTS, FAQ, GLOSSARY, HUBS,
} from '../src/data.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const SECTIONS = [
  ['summary', 'Executive summary'],
  ['story', 'The problem in plain words'],
  ['rulebooks', 'The three reporting rulebooks'],
  ['hard', 'Why this is hard'],
  ['solution', 'How BreachWatch works'],
  ['example', 'Worked example: one incident, start to finish'],
  ['workflow', 'The AI workflow and the human sign-off'],
  ['access', 'Who can do what'],
  ['data', 'Data quality and the three models'],
  ['structure', 'Project structure'],
  ['running', 'Running the system'],
  ['faq', 'Frequently asked questions'],
  ['glossary', 'Glossary'],
  ['appendix', 'Appendix: technical reference'],
]
const num = (id) => SECTIONS.findIndex(([k]) => k === id) + 1
const H = (id) => `<h1 id="${id}"><span class="n">${String(num(id)).padStart(2, '0')}</span>${esc(SECTIONS[num(id) - 1][1])}</h1>`

const nodeKind = (n) => (n.kind === 'agent' ? 'AI helper' : n.kind === 'gate' ? 'Person' : 'Computer')
const tone = { emerald: '#047857', amber: '#b45309', rose: '#be123c' }

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>BreachWatch AI — Project Overview</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root { --ink:#0f172a; --body:#334155; --muted:#64748b; --line:#e2e8f0; --soft:#f1f5f9; --teal:#0e7490; --teal2:#06b6d4; --amber:#b45309; --violet:#6d28d9; --rose:#be123c; --green:#047857; }
  * { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  @page { size:A4; margin:18mm 17mm 20mm;
    @bottom-left { content:"BreachWatch AI · Project Overview"; font:500 8pt Inter, 'Segoe UI', sans-serif; color:#94a3b8; }
    @bottom-right { content:"Page " counter(page) " of " counter(pages); font:500 8pt Inter, 'Segoe UI', sans-serif; color:#94a3b8; } }
  @page cover { margin:0; @bottom-left { content:none } @bottom-right { content:none } }
  html { font:9.6pt/1.5 Inter, 'Segoe UI', system-ui, sans-serif; color:var(--body); }
  body { margin:0; }
  h1 { font-size:20pt; color:var(--ink); margin:0 0 4mm; padding-bottom:3mm; border-bottom:2px solid var(--teal2); break-after:avoid; display:flex; align-items:baseline; gap:4mm; letter-spacing:-.01em; }
  h1 .n { font:600 11pt 'JetBrains Mono', monospace; color:var(--teal2); }
  h2 { font-size:12pt; color:var(--ink); margin:5mm 0 2mm; break-after:avoid; }
  h3 { font-size:10.5pt; color:var(--ink); margin:0 0 1mm; }
  p { margin:0 0 2.5mm; }
  .lead { font-size:11pt; color:var(--body); margin-bottom:5mm; }
  .chapter { break-before:page; }
  .muted { color:var(--muted); } .small { font-size:8.5pt; }
  .mono { font-family:'JetBrains Mono', monospace; font-size:8.5pt; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:4mm; } .grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:3.5mm; }
  .card { border:1px solid var(--line); border-radius:3mm; padding:3.2mm 3.6mm; background:#fff; break-inside:avoid; }
  .card.soft { background:var(--soft); border-color:transparent; }
  .tag { display:inline-block; white-space:nowrap; flex-shrink:0; font-size:7.5pt; font-weight:600; padding:.6mm 2.2mm; border-radius:10mm; border:1px solid; letter-spacing:.02em; }
  .callout { border-left:3px solid var(--teal2); background:#ecfeff; padding:3mm 4mm; border-radius:0 2.5mm 2.5mm 0; margin:3.5mm 0; break-inside:avoid; }
  .callout.amber { border-color:#f59e0b; background:#fffbeb; } .callout.rose { border-color:#f43f5e; background:#fff1f2; }
  .callout b:first-child { color:var(--ink); }
  table { width:100%; border-collapse:collapse; font-size:9pt; margin:2mm 0 4mm; break-inside:auto; }
  th { text-align:left; background:var(--ink); color:#fff; font-weight:600; padding:2mm 2.5mm; font-size:8.5pt; }
  td { padding:1.6mm 2.4mm; border-bottom:1px solid var(--line); vertical-align:top; }
  table.compact td { padding:1.2mm 2.2mm; font-size:8.4pt; } table.compact .mono { font-size:7.8pt; }
  tr { break-inside:avoid; } tr:nth-child(even) td { background:#f8fafc; }
  .yes { color:var(--green); font-weight:700; } .no { color:#cbd5e1; font-weight:700; }
  ul.tidy { margin:1mm 0 2mm; padding-left:4.5mm; } ul.tidy li { margin-bottom:.8mm; }
  .steps { counter-reset:s; } .step { display:grid; grid-template-columns:9mm 1fr; gap:3mm; margin-bottom:3mm; break-inside:avoid; }
  .step .b { width:8mm; height:8mm; border-radius:50%; background:var(--ink); color:#fff; font-weight:700; font-size:9pt; display:grid; place-items:center; }
  .who { font-size:7.5pt; font-weight:600; color:var(--teal); text-transform:uppercase; letter-spacing:.06em; }
  .bar { height:2.4mm; border-radius:2mm; background:#fecdd3; overflow:hidden; } .bar i { display:block; height:100%; background:var(--teal2); }
  .flow { display:flex; flex-direction:column; align-items:center; gap:0; }
  .node { width:130mm; border:1px solid; border-radius:2.5mm; padding:1.6mm 3.5mm; display:flex; justify-content:space-between; gap:3mm; align-items:center; font-size:9pt; break-inside:avoid; }
  .node.tool { border-color:#99f6e4; background:#f0fdfa; } .node.agent { border-color:#ddd6fe; background:#f5f3ff; } .node.gate { border-color:#fcd34d; background:#fffbeb; border-width:2px; }
  .node b { color:var(--ink); } .arrow { height:3mm; width:1px; background:#94a3b8; }
  .lanes { display:grid; grid-template-columns:repeat(3,1fr); gap:3mm; width:100%; margin-top:1mm; }
  .lane { border:1.5px dashed; border-radius:2.5mm; padding:3mm; font-size:8.5pt; break-inside:avoid; }
  .lane .node { width:100%; margin-top:2mm; font-size:8.5pt; }
  .kpi { display:grid; grid-template-columns:repeat(6,1fr); gap:3mm; margin:5mm 0; }
  .kpi div { border:1px solid var(--line); border-radius:2.5mm; padding:3mm; } .kpi b { display:block; font-size:16pt; color:var(--ink); line-height:1.1; } .kpi span { font-size:7.5pt; color:var(--muted); }
  .toc { list-style:none; padding:0; margin:6mm 0 0; } .toc li { display:flex; gap:4mm; padding:2.6mm 0; border-bottom:1px solid var(--line); font-size:11pt; color:var(--ink); }
  .toc .n { font:600 10pt 'JetBrains Mono', monospace; color:var(--teal2); width:9mm; }
  .tree { font-family:'JetBrains Mono', monospace; font-size:8.5pt; }
  pre { font:8pt/1.5 'JetBrains Mono', monospace; background:#0f172a; color:#a7f3d0; padding:3.5mm; border-radius:2.5mm; white-space:pre-wrap; break-inside:avoid; margin:1.5mm 0 3mm; }
  /* cover */
  .cover { page:cover; height:297mm; width:210mm; background:#0b1220; color:#cbd5e1; position:relative; overflow:hidden; padding:28mm 22mm; display:flex; flex-direction:column; }
  .cover .grid { position:absolute; inset:0; background-image:linear-gradient(rgba(34,211,238,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.07) 1px,transparent 1px); background-size:12mm 12mm; }
  .cover .glow { position:absolute; width:180mm; height:180mm; border-radius:50%; background:radial-gradient(circle,rgba(6,182,212,.28),transparent 65%); top:-60mm; right:-60mm; }
  .cover > * { position:relative; }
  .cover .badge { display:inline-flex; align-items:center; gap:2mm; border:1px solid rgba(34,211,238,.4); color:#67e8f9; border-radius:10mm; padding:1.2mm 3.5mm; font-size:8.5pt; font-weight:600; width:max-content; }
  .cover h1.t { border:0; font-size:44pt; font-weight:800; color:#fff; margin:16mm 0 0; padding:0; display:block; letter-spacing:-.02em; line-height:1.05; }
  .cover h1.t em { font-style:normal; color:#22d3ee; }
  .cover .sub { font-size:16pt; color:#e2e8f0; margin-top:6mm; max-width:150mm; line-height:1.35; }
  .cover .sub span { color:#22d3ee; } .cover .sub i { font-style:normal; color:#fbbf24; }
  .cover .pillars { margin-top:auto; display:grid; grid-template-columns:repeat(3,1fr); gap:4mm; }
  .cover .pillars div { border:1px solid rgba(148,163,184,.25); border-radius:3mm; padding:4mm; background:rgba(15,23,42,.6); }
  .cover .pillars b { display:block; color:#fff; font-size:10.5pt; margin-bottom:1mm; } .cover .pillars span { font-size:8.5pt; color:#94a3b8; }
  .cover .meta { margin-top:10mm; display:flex; justify-content:space-between; font-size:8.5pt; color:#64748b; border-top:1px solid rgba(148,163,184,.2); padding-top:4mm; }
</style></head><body>

<section class="cover">
  <div class="grid"></div><div class="glow"></div>
  <div class="badge">● Merrowfield Digital · Security Operations</div>
  <h1 class="t">BreachWatch <em>AI</em></h1>
  <div class="sub">Security incident triage and breach reporting: deciding <span>who must be told</span>, and <i>by when</i>, without missing a legal deadline.</div>
  <p style="margin-top:8mm;max-width:150mm;color:#94a3b8;font-size:10.5pt">Project overview for the whole team. Plain-English first, with a technical appendix at the end.</p>
  <div class="pillars">
    <div><b>1 · The computer does the maths</b><span>Laws, deadlines, totals and hours, worked out by code and trained models.</span></div>
    <div><b>2 · AI writes the explanation</b><span>Five AI helpers turn the facts into a briefing. They never change a number.</span></div>
    <div><b>3 · A person decides</b><span>Nothing is sent to a regulator or customer without the Data Protection Officer.</span></div>
  </div>
  <div class="meta"><span>Project overview · Version 1.0</span><span>${today}</span></div>
</section>

<section class="chapter" style="break-before:page">
  <h1 style="display:block">Contents</h1>
  <ol class="toc">${SECTIONS.map(([id, t], i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(t)}</li>`).join('')}</ol>
  <div class="callout" style="margin-top:10mm"><b>How to read this document.</b> Sections 1–8 explain the problem and the solution without technical terms. Sections 9–11 describe the data, code and setup. The appendix collects the technical names (settings, functions, endpoints and database tables) for engineers.</div>
</section>

<section class="chapter">
  ${H('summary')}
  <p class="lead">Merrowfield Digital runs an online marketplace with about <b>9 million customers</b> and <b>60,000 sellers</b> across Europe and India. When a security incident happens, the law may require the company to tell certain authorities, and sometimes its customers, within a few hours. <b>BreachWatch AI</b> helps the security team get that right every time.</p>
  <div class="kpi">${[['9M', 'customers'], ['60K', 'sellers'], ['4', 'security hubs, 24/7'], ['3', 'reporting laws'], ['16', 'company PDFs'], ['5–7', 'AI calls per incident']].map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
  <h2>What it does, in one sentence</h2>
  <p>It <b>ranks</b> open incidents by how close each is to a legal deadline, <b>works out</b> every authority that must be told and by when, <b>drafts</b> a recommendation, and then <b>stops</b>, so that nothing is filed and no customer is told on the word of an AI.</p>
  <h2>The core design idea</h2>
  <div class="grid3">
    <div class="card"><h3>Computer: the maths</h3><p class="small">Which laws apply, when each deadline falls, how many hours are left, how many customers are affected across an attack. Done by ordinary code and trained models, identically every time, so it can be audited.</p></div>
    <div class="card"><h3>AI: the words</h3><p class="small">Five AI helpers each write one part of a briefing, using only the facts they are given. They are explicitly told never to recalculate or change a number.</p></div>
    <div class="card"><h3>Person: the decision</h3><p class="small">The Data Protection Officer reads the briefing and decides, with a written reason. The pause is saved, so it survives a restart.</p></div>
  </div>
  <h2>What the team gets</h2>
  <ul class="tidy">
    <li>An incident list sorted by real urgency, with the deadline that is due <i>first</i> at the top.</li>
    <li>For each incident: which laws apply and why, every deadline, the risk to customers, the likely attack type, and whether there is time to finish the work.</li>
    <li>A ready-to-read briefing and recommendation, plus draft regulator reports and customer notices once a decision is made.</li>
    <li>A complete audit trail: every assessment, decision, AI call and chat question is recorded.</li>
    <li>A chat assistant that answers only from company documents and refuses rather than guessing.</li>
  </ul>
  <div class="callout amber"><b>Why it matters.</b> Report too late and the company has a legal failure on the record that regulators read at inspection. Report when nothing had to be reported and three authorities hear about something that never affected a customer. Both mistakes are costly.</div>
</section>

<section class="chapter">
  ${H('story')}
  <p class="lead">No technical knowledge is needed for this section.</p>
  <div class="grid2">${STORY.map((s) => `<div class="card"><div class="mono" style="color:var(--teal2);font-weight:600">${s.n}</div><h3>${esc(s.title)}</h3><p class="small" style="margin:0">${esc(s.text)}</p></div>`).join('')}</div>
  <div class="callout"><b>An everyday comparison: a hospital emergency room.</b> A triage nurse doesn't treat patients in order of arrival. They check who is most urgent and send them to the right doctor. BreachWatch does the same for security incidents: the most urgent go to the top, it works out which authorities must be told and by when, and it prepares the paperwork. The senior doctor, here the Data Protection Officer, still makes the call.</div>
  <h2>The four security hubs</h2>
  <table><tr><th>Hub</th><th>Time zone</th><th>Incident references start with</th></tr>
  ${HUBS.map((h) => `<tr><td><b>${h.name}</b></td><td>${h.tz}</td><td class="mono">INC-${h.code}-…</td></tr>`).join('')}</table>
  <p class="small muted">Each hub records times in its own local time. BreachWatch converts every time to one standard (UTC) and measures every "hours left" figure from one fixed moment: the time the incident list was exported, called the <b>snapshot</b>. Everyone therefore sees the same numbers, today and tomorrow.</p>
</section>

<section class="chapter">
  ${H('rulebooks')}
  <p class="lead">Merrowfield must follow three reporting rules, each written in its own PDF document. One incident can fall under one, two, all three, or none of them.</p>
  <table><tr><th style="width:24%">Rulebook</th><th style="width:26%">Who must be told</th><th>When it applies</th></tr>
  ${PROCEDURES.map((p) => `<tr><td><b>${esc(p.short)}: ${esc(p.title)}</b><br><span class="small muted">${esc(p.tag)}</span></td><td>${esc(p.authority)}</td><td>${esc(p.plain)}<br><span class="small muted">${esc(p.extra)}</span></td></tr>`).join('')}</table>
  <div class="callout rose"><b>Golden rule: no deadlines in the software.</b> The number of hours each rulebook allows is never typed into the code or the settings. The system reads it from each rulebook's own PDF at the moment it is needed. If a rulebook changes, the new deadline is picked up automatically. If a rulebook cannot be read, the system stops with an error instead of guessing.</div>
  <h2>Deadlines start at different moments</h2>
  <p>Each rulebook says which moment its stopwatch starts from:</p>
  <div class="grid2">
    <div class="card soft"><h3>The first alert</h3><p class="small" style="margin:0">The moment any Merrowfield tool first noticed something. It usually comes hours before anyone has confirmed anything.</p></div>
    <div class="card soft"><h3>Awareness (confirmation)</h3><p class="small" style="margin:0">The moment an analyst confirmed the incident is real. Until then, deadlines that count from awareness have not started.</p></div>
  </div>
  <p style="margin-top:3mm">An unconfirmed incident can therefore already have a running deadline. Where several deadlines apply, <b>the one that falls due first governs the work</b>. A deadline that has already passed is shown as negative hours (for example −64 h), never as zero.</p>
  <h2>The deadline that is counted from a filing</h2>
  <p>One milestone is different: a <b>final report</b>, due a number of months after the first report was actually sent. It can only be worked out once a decision to file has been taken.</p>
</section>

<section class="chapter">
  ${H('hard')}
  <div class="grid2">
    <div class="card"><h3>Different time zones</h3><p class="small" style="margin:0">Four offices each write times in their own local time, in four different notations. Comparing them by eye is easy to get wrong.</p></div>
    <div class="card"><h3>Three laws, three stopwatches</h3><p class="small" style="margin:0">Different lengths, different starting moments, different authorities. The deadline everyone remembers is often not the one due first.</p></div>
    <div class="card"><h3>Small incidents add up</h3><p class="small" style="margin:0">Several incidents can belong to one attack (a <b>campaign</b>). Customers are counted across the whole campaign, so incidents that are small alone can together cross the "significant incident" limit.</p></div>
    <div class="card"><h3>Messy data</h3><p class="small" style="margin:0">The spreadsheets arrive with real defects. Nothing downstream may assume a clean table.</p></div>
  </div>
  <h2>Examples of messy data, and what BreachWatch turns them into</h2>
  <table class="compact"><tr><th style="width:30%">Problem</th><th style="width:38%">Before</th><th>After</th></tr>
  ${DEFECTS.map((d) => `<tr><td><b>${esc(d.name)}</b></td><td class="mono">${esc(d.before)}</td><td>${esc(d.after)}</td></tr>`).join('')}</table>
</section>

<section class="chapter">
  ${H('solution')}
  <p class="lead">BreachWatch is built from four blocks. Each block hands finished facts to the next, so by the time AI is involved there is nothing left to calculate.</p>
  ${[
    ['1 · Learn from the past', 'The messy spreadsheets are cleaned, and every problem found is counted in a quality report as proof. Three models then learn from thousands of past incidents so they can make quick, consistent estimates about new ones: a <b>risk model</b> (how likely the affected people are at high risk), a <b>workload model</b> (how many analyst hours the work will take) and a <b>notes reader</b> (which of eight attack types the analysts\u2019 notes describe).'],
    ['2 · Read the rulebooks', 'The company\u2019s 16 PDFs are the only source of truth. They are cut into short passages and made searchable by meaning. When a deadline is needed, the system searches <b>only inside that law\u2019s own PDF</b> and reads the number from the sentence. Because the three rulebooks share a template and many identical sentences, searching all of them at once could return the EU deadline when you asked about India, so this is not allowed.'],
    ['3 · Do the maths', 'Ordinary, predictable code works out which laws apply and why, when each deadline falls, which one comes first, how many hours are left, and whether the estimated work fits before the deadline once a small filing buffer is set aside. It also sorts the whole incident list: running deadlines first (overdue at the very top), then the rest by risk.'],
    ['4 · AI helpers and the sign-off', 'Five AI helpers each write one part of the briefing, using only the facts above. Then the system stops and waits for the Data Protection Officer. The pause is saved to disk, so the machine can be restarted without losing anything.'],
  ].map(([t, d]) => `<div class="card" style="margin-bottom:3.5mm"><h3>${t}</h3><p style="margin:0">${d}</p></div>`).join('')}
  <h2>Worked example: is there enough time? (illustrative numbers)</h2>
  <table style="width:70%"><tr><th>Item</th><th style="text-align:right">Value</th></tr>
  ${[['Hours left until the earliest deadline', '12.0 h'], ['Filing buffer kept aside', '− 2.0 h'], ['Time available', '10.0 h'], ['Work needed (workload model + sensitive-data extra)', '13.5 h']].map(([k, v]) => `<tr><td>${k}</td><td style="text-align:right" class="mono">${v}</td></tr>`).join('')}</table>
  <p><b style="color:var(--rose)">Result: it doesn't fit.</b> The briefing will say plainly that the desk has to handle this incident differently.</p>
</section>

<section class="chapter">
  ${H('example')}
  <p class="lead">A made-up example: a fake login page tricks some sellers into giving away their passwords. Numbers are illustrative; in the real system, deadlines come from the rulebook PDFs.</p>
  <div class="steps">${WALKTHROUGH.map((w, i) => `<div class="step"><div class="b">${i + 1}</div><div><div class="who">${esc(w.who)}</div><h3>${esc(w.t)}</h3><p class="small" style="margin:0">${esc(w.text)}</p></div></div>`).join('')}</div>
</section>

<section class="chapter">
  ${H('workflow')}
  <p class="lead">An assessment runs through ten steps. Six prepare the briefing, one is the human sign-off, and the rest depend on what the Data Protection Officer decides.</p>
  <div class="flow">
    ${NODES.slice(0, 7).map((n, i) => `${i ? '<div class="arrow"></div>' : ''}<div class="node ${n.kind}"><span><b>${esc(n.label)}</b><br><span class="small muted">${esc(n.plain)}</span></span><span class="tag" style="color:${n.kind === 'agent' ? 'var(--violet)' : n.kind === 'gate' ? 'var(--amber)' : 'var(--teal)'}">${nodeKind(n)}${n.calls ? ' · 1 call' : ''}</span></div>`).join('')}
    <div class="arrow"></div>
    <div class="lanes">
      ${DECISIONS.map((d) => `<div class="lane" style="border-color:${tone[d.tone]}"><b style="color:${tone[d.tone]}">${esc(d.label)}</b> <span class="small muted">(${d.calls} AI calls)</span><br><span class="small">${esc(d.plain)}</span>
        ${d.path.length ? d.path.map((id) => { const n = NODES.find((x) => x.id === id); return `<div class="node agent"><b>${esc(n.label)}</b></div>` }).join('') : '<div class="node tool" style="justify-content:center"><span class="muted">nothing more to write</span></div>'}</div>`).join('')}
    </div>
    <div class="arrow"></div>
    <div class="node tool"><span><b>Save everything</b><br><span class="small muted">${esc(NODES[9].plain)}</span></span><span class="tag" style="color:var(--teal)">Computer</span></div>
  </div>
  <h2>House rules for the AI</h2>
  <ul class="tidy"><li>Exactly one AI call per helper, so the cost per incident is fixed: <b>5</b> before the decision, then <b>+0</b>, <b>+1</b> or <b>+2</b>. Every run is checked against this budget.</li><li>Never recalculate or change a number; use only the facts and rulebook passages provided; never apply one law's deadline to another.</li><li>The customer notice never contains internal system names, ticket numbers, staff names, campaign references or guesses about who was behind the attack.</li><li>Every AI call is logged with its size and how long it took.</li></ul>
</section>

<section class="chapter">
  ${H('access')}
  <p class="lead">Everyone signs in. Each role sees only the pages its job needs, and the back-end service refuses any request outside a role's permissions. It does not rely on the screens hiding a button.</p>
  <table><tr><th>Role</th>${AREAS.map((a) => `<th style="text-align:center">${esc(a.plain)}</th>`).join('')}</tr>
  ${ROLES.map((r) => `<tr><td><b>${esc(r.name)}</b></td>${AREAS.map((a) => `<td style="text-align:center" class="${r.areas.includes(a.id) ? 'yes' : 'no'}">${r.areas.includes(a.id) ? '✓' : '—'}</td>`).join('')}</tr>`).join('')}</table>
  ${ROLES.map((r) => `<p><b>${esc(r.name)}:</b> ${esc(r.note)}</p>`).join('')}
  <div class="callout"><b>Investigating is not deciding.</b> The Incident Response Plan says the analyst who investigates may not decide whether to notify. That is the reason the workflow stops for a person.</div>
  <h2>The chat assistant cannot be used to snoop</h2>
  <p>A Customer Communications Agent writes to customers, so they must not learn about an incident before customers have been told. If they ask about a specific incident before that point, they receive <b>exactly the same refusal whether the incident exists or not</b>. Otherwise, asking about made-up references would reveal which ones are real. Once customers have been told, the same question is answered from the published notice and nothing else. Analysts and the DPO are answered from the internal record at any stage.</p>
  <h2>Other safeguards</h2>
  <ul class="tidy"><li>Passwords are never stored, only a salted, scrambled form with a separate salt per account.</li><li>A wrong username and a wrong password show the same error, so nobody can discover which usernames exist.</li><li>The chat answers only from company documents, refuses when they do not cover the question, and never reads the confidential past-cases casebook.</li><li>A decision cannot be recorded twice, and every decision needs a written reason.</li></ul>
</section>

<section class="chapter">
  ${H('data')}
  <h2>How much data survived cleaning</h2>
  <table><tr><th>Dataset</th><th style="text-align:right">Received</th><th style="text-align:right">Kept</th><th style="text-align:right">Removed</th><th style="width:28%">Kept share</th></tr>
  ${DATASETS.map((d) => `<tr><td>${esc(d.name)}</td><td style="text-align:right" class="mono">${d.received.toLocaleString()}</td><td style="text-align:right" class="mono">${d.kept.toLocaleString()}</td><td style="text-align:right" class="mono">${(d.received - d.kept).toLocaleString()}</td><td><div class="bar"><i style="width:${(d.kept / d.received * 100).toFixed(1)}%"></i></div><span class="small muted">${(d.kept / d.received * 100).toFixed(1)}%</span></td></tr>`).join('')}</table>
  <p class="small muted">Removed rows were exact duplicates, rows with no answer to learn from, or notes too short to be useful. Every gap left is filled, so the cleaned tables have no empty cells.</p>
  <h2>The three models</h2>
  ${MODELS.map((m) => `<div class="card" style="margin-bottom:3.5mm"><h3>${esc(m.name)}: <span style="font-weight:500;color:var(--teal)">“${esc(m.question)}”</span></h3><p class="small">${esc(m.plain)}</p><p class="small" style="margin:0"><b>Common-sense checks it must pass:</b> ${m.checks.map(esc).join('; ')}.</p></div>`).join('')}
  <p class="small"><b>The eight attack types:</b> ${ATTACK_TYPES.map(esc).join(' · ')}.</p>
  <p class="small muted">Each model is tested on a separate set of incidents that was kept aside during training, and each must reach a minimum score set in the configuration.</p>
</section>

<section class="chapter">
  ${H('structure')}
  <p class="lead">The project is split into ten folders, each with a single job.</p>
  <table><tr><th style="width:22%">Folder</th><th style="width:28%">In plain words</th><th>What it does</th></tr>
  ${TREE.map((d) => `<tr><td class="mono">${d.dir}/</td><td><b>${esc(d.plain)}</b></td><td>${esc(d.blurb)}</td></tr>`).join('')}</table>
  <h2>The 16 company documents</h2>
  <table><tr><th>Document</th><th>What it covers</th></tr>
  ${DOCS16.map((d) => `<tr><td class="mono">${esc(d.name)}</td><td>${esc(d.plain)}</td></tr>`).join('')}</table>
</section>

<section class="chapter">
  ${H('running')}
  <p class="lead">Six commands, run once in order from the Project folder. Steps 1–4 prepare everything; steps 5 and 6 start the system for people to use.</p>
  ${ENTRY_POINTS.map((e) => `<div class="step"><div class="b">${e.n}</div><div><h3>${esc(e.title)}</h3><p class="small">${esc(e.does)}</p><pre>$ ${esc(e.cmd || `python3 ${e.file}`)}</pre></div></div>`).join('')}
  <p class="small muted">Install the dependencies first with <span class="mono">pip install -r requirements.txt</span>. The back-end runs on port 8082 (interactive API documentation at <span class="mono">/docs</span>) and the dashboard on port 8501.</p>
</section>

<section class="chapter">
  ${H('faq')}
  ${FAQ.map((f) => `<div class="card" style="margin-bottom:3mm"><h3>${esc(f.q)}</h3><p class="small" style="margin:0">${esc(f.a)}</p></div>`).join('')}
</section>

<section class="chapter">
  ${H('glossary')}
  <table><tr><th style="width:28%">Term</th><th>Meaning</th></tr>
  ${Object.values(GLOSSARY).map((g) => `<tr><td><b>${esc(g.term)}</b></td><td>${esc(g.def)}</td></tr>`).join('')}</table>
</section>

<section class="chapter">
  ${H('appendix')}
  <p class="lead">For engineers: the technical names behind the plain-English descriptions.</p>
  <h2>A.1 Technology</h2>
  <table><tr><th>Concern</th><th>Technology</th></tr>
  ${[['Data cleaning & models', 'pandas, scikit-learn (pipelines with built-in preparation)'], ['Document library', 'PDF text extraction, ChromaDB vector store, cosine distance'], ['AI workflow', 'LangGraph state graph with interrupt + SQLite checkpointer; Gemini via .env'], ['Back-end service', 'FastAPI with Pydantic schemas, session-token guard'], ['Database', 'SQLAlchemy over SQLite (six tables)'], ['Dashboard', 'Streamlit, five pages, all figures fetched from the service']].map(([a, b]) => `<tr><td><b>${a}</b></td><td>${b}</td></tr>`).join('')}</table>
  <h2>A.2 Reporting procedures</h2>
  <table><tr><th>Code (config)</th><th>Document</th><th>Applies when</th></tr>
  ${PROCEDURES.map((p) => `<tr><td class="mono">${p.code}</td><td class="mono">${p.doc}</td><td class="mono">${p.applies.map(esc).join('<br>')}</td></tr>`).join('')}</table>
  <h2>A.3 Workflow nodes</h2>
  <table><tr><th>Node</th><th>Agent name</th><th>Reply fields</th><th style="text-align:center">LLM calls</th></tr>
  ${NODES.map((n) => `<tr><td class="mono">${n.id}</td><td class="mono">${n.agent || '—'}</td><td class="mono">${esc(n.fields || '—')}</td><td style="text-align:center">${n.calls}</td></tr>`).join('')}</table>
  <h2>A.4 Models</h2>
  <table><tr><th>Model</th><th>Type</th><th>Target</th><th>Pass mark</th></tr>
  ${MODELS.map((m) => `<tr><td><b>${m.name}</b></td><td>${esc(m.tech.kind)}</td><td class="mono">${esc(m.tech.target)}</td><td class="mono">${esc(m.tech.gate)}</td></tr>`).join('')}</table>
  <h2>A.5 REST endpoints</h2>
  <table><tr><th>Method</th><th>Path</th><th>Purpose</th></tr>
  ${[['POST', '/auth/signin', 'Exchange username + password for a session token'], ['POST', '/auth/signout', 'End the session'], ['GET', '/queue', 'Ranked incident queue, filterable by harm band'], ['GET', '/queue/{incident_reference}', 'Everything the tools establish about one incident (no LLM)'], ['POST', '/assessments', 'Run the workflow to the gate (5 LLM calls)'], ['GET', '/incidents', 'Assessments by status (decision queue / audit trail)'], ['POST', '/incidents/{assessment_id}/decision', 'Record the DPO decision and resume (DPO only)'], ['GET', '/incidents/{assessment_id}/calls', 'Call budget: actual vs. expected LLM calls'], ['POST', '/chat/ask', 'One grounded chat answer (1 LLM call)'], ['GET', '/chat/turns', 'The signed-in person\u2019s own chat history'], ['GET', '/audit/chat-turns', 'Everyone\u2019s recent chat turns (audit area)']].map(([m, p, d]) => `<tr><td class="mono">${m}</td><td class="mono">${esc(p)}</td><td>${esc(d)}</td></tr>`).join('')}</table>
  <p class="small muted">Errors: 401 not signed in · 403 role does not reach the area · 404 unknown incident/assessment · 409 already decided · 422 invalid value · 502 language-model failure (with the reason).</p>
  <h2>A.6 Database tables</h2>
  <table><tr><th>Table</th><th>Holds</th></tr>
  ${[['user_accounts', 'Sign-in accounts: role, salted password hash, current session token'], ['agent_runs', 'Each workflow run: thread id, status, LLM call count, start/finish'], ['security_incidents', 'Each assessment: facts, deadlines, effort, agent text, recommendation, documents, status'], ['dpo_decisions', 'Each decision: disposition, who, role, reason, when'], ['llm_calls', 'Each language-model call: agent, model, sizes, latency'], ['chat_turns', 'Each chat question: who, type, answer, sources, distance, refused']].map(([t, d]) => `<tr><td class="mono">${t}</td><td>${d}</td></tr>`).join('')}</table>
</section>

</body></html>`

mkdirSync(resolve(root, 'docs-pdf'), { recursive: true })
mkdirSync(resolve(root, 'public'), { recursive: true })
const htmlPath = resolve(root, 'docs-pdf/overview.html')
const pdfPath = resolve(root, 'public/BreachWatch-AI-Project-Overview.pdf')
writeFileSync(htmlPath, html)

const browsers = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
]
const browser = browsers.find(existsSync)
if (!browser) throw new Error('No Edge or Chrome found to print the PDF.')
execFileSync(browser, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href], { stdio: 'ignore' })
console.log(`PDF written to ${pdfPath}`)
