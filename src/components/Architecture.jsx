import { useState } from 'react'
import { Database, Library, Calculator, Workflow, ShieldAlert, Timer, FileSearch, FileText, Scissors, Boxes, Filter, XCircle, CheckCircle2, ArrowRight, Lock, Ban, PauseCircle } from 'lucide-react'
import { MODELS, DATASETS, DOCS16, PROCEDURES, ATTACK_TYPES } from '../data'
import { Section, Tabs, CodeBlock, Callout, Term } from './ui'

const ICONS = { ShieldAlert, Timer, FileSearch }

function PillarData() {
  const [m, setM] = useState('harm')
  const model = MODELS.find((x) => x.id === m)
  const Icon = ICONS[model.icon]
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card p-6 lg:col-span-2">
          <h4 className="font-semibold text-white">Cleaning engine: what survived</h4>
          <p className="mt-1 text-xs text-slate-500">Rows received → kept, from the expected pipeline output.</p>
          <div className="mt-5 space-y-4">
            {DATASETS.map((d) => {
              const pct = (d.kept / d.received) * 100
              return (
                <div key={d.name}>
                  <div className="mb-1 flex justify-between font-mono text-[11px]"><span className="text-slate-300">{d.name}</span><span className="text-slate-500">{d.kept.toLocaleString()} / {d.received.toLocaleString()}</span></div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-slate-800" title={`${(d.received - d.kept).toLocaleString()} removed`}>
                    <div className="bg-teal-400" style={{ width: `${pct}%` }} /><div className="bg-rose-400/70" style={{ width: `${100 - pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex gap-4 text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-teal-400" />kept</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-rose-400/70" />duplicates · no answer · short notes</span></div>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">Every figure is measured and written to <span className="code">output/data_quality_report.json</span>: duplicates, missing cells per column, out-of-range readings, timestamp notations, and <span className="code">missing_cells_after_cleaning = 0</span>.</p>
        </div>
        <div className="card p-6 lg:col-span-3">
          <Tabs size="sm" active={m} onChange={setM} tabs={MODELS.map((x) => ({ id: x.id, label: x.name, icon: ICONS[x.icon] }))} />
          <div key={m} className="mt-5 animate-fadeIn">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"><Icon size={22} /></span>
              <div>
                <h4 className="text-lg font-semibold text-white">{model.name} <span className="ml-1 text-sm font-normal text-slate-500">· {model.kind}</span></h4>
                <p className="text-xs text-slate-500">{model.estimator}</p>
              </div>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              {[['Target', model.target], ['Gate to pass', model.metric], ['Feeds', model.out]].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3"><dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k}</dt><dd className="mt-1 text-slate-200">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Behaviour checks: must move the right way</div>
            <ul className="mt-2 grid gap-1.5 text-sm text-slate-300 sm:grid-cols-2">
              {model.checks.map((c) => <li key={c} className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />{c}</li>)}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">{model.metrics.map((x) => <span key={x} className="chip border-slate-700 font-mono text-slate-400">{x}</span>)}</div>
            {m === 'attack' && <div className="mt-4 flex flex-wrap gap-1.5">{ATTACK_TYPES.map((t) => <span key={t} className="chip border-violet-500/30 bg-violet-500/10 text-violet-300">{t}</span>)}</div>}
          </div>
        </div>
      </div>
      <Callout tone="cyan" icon={Boxes} title="Preparation lives inside the model">
        Each model is saved as one scikit-learn <span className="code">Pipeline</span>: imputation, encoding (unseen categories handled) and the estimator together, plus a JSON feature schema. A single raw queue row can be scored with no extra preparation.
      </Callout>
    </div>
  )
}

function PillarRag() {
  const [isolated, setIsolated] = useState(true)
  const steps = [
    { i: FileText, t: 'Extract', d: '16 PDFs, pages in order' },
    { i: Scissors, t: 'Section', d: 'In-sequence numbered headings' },
    { i: Scissors, t: 'Chunk', d: 'Whole sentences, overlapping' },
    { i: Boxes, t: 'Embed', d: 'Chroma, cosine distance' },
    { i: Filter, t: 'Filter', d: 'document_name = own PDF' },
    { i: Calculator, t: 'Regex', d: 'MILESTONE_STATEMENT_PATTERN' },
  ]
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map(({ i: I, t, d }, k) => (
          <div key={t} className="card card-hover relative p-4">
            <span className="font-mono text-[10px] text-slate-600">0{k + 1}</span>
            <I size={18} className="mt-1 text-violet-400" />
            <div className="mt-2 text-sm font-semibold text-white">{t}</div>
            <div className="text-xs text-slate-500">{d}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-semibold text-white">Strict corpus isolation</h4>
            <div className="flex rounded-lg border border-slate-800 p-0.5 text-xs">
              <button onClick={() => setIsolated(false)} className={`rounded-md px-3 py-1.5 ${!isolated ? 'bg-rose-500/15 text-rose-300' : 'text-slate-400'}`}>Global search</button>
              <button onClick={() => setIsolated(true)} className={`rounded-md px-3 py-1.5 ${isolated ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-400'}`}>Restricted</button>
            </div>
          </div>
          <p className="mt-2 font-mono text-xs text-slate-500">query: DEADLINE_QUESTION_TEMPLATE(PROCEDURE_INDIA_CYBER_INCIDENT)</p>
          <div className="mt-4 space-y-2">
            {(isolated
              ? [[PROCEDURES[2].doc, 0.18, true], [PROCEDURES[2].doc, 0.22, true], [PROCEDURES[2].doc, 0.27, true]]
              : [[PROCEDURES[0].doc, 0.17, false], [PROCEDURES[2].doc, 0.18, true], [PROCEDURES[1].doc, 0.19, false]]
            ).map(([doc, dist, ok], i) => (
              <div key={i} className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-xs ${ok ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
                <span className="flex min-w-0 items-center gap-2">{ok ? <CheckCircle2 size={14} className="shrink-0 text-emerald-400" /> : <XCircle size={14} className="shrink-0 text-rose-400" />}<span className="truncate font-mono text-slate-300">{doc}</span></span>
                <span className="font-mono text-slate-500">d={dist}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-400">
            {isolated
              ? 'Every passage comes from Procedure 03’s own PDF, so its milestones are read from its own words.'
              : 'The procedures share a template. The nearest passage belongs to Procedure 01, so CERT-In would be given the EU deadline. Confident, and wrong.'}
          </p>
        </div>
        <div className="space-y-4">
          <CodeBlock title="knowledge/procedure_reading.py (shape)" code={`hits = search_documents(
    collection,
    [config.DEADLINE_QUESTION_TEMPLATE.format(code=code)],
    config.PROCEDURE_RESULT_COUNT,
    {"document_name": config.PROCEDURE_DOCUMENT_BY_CODE[code]},
)[0]

for m in re.finditer(config.MILESTONE_STATEMENT_PATTERN, text):
    phrase = m["clock_start"]
    milestones.append({
        "milestone": m["milestone"],
        "hours": int(m["hours"]),            # from the PDF
        "clock_start_phrase": phrase,
        "clock_start_column": config.CLOCK_START_COLUMN_BY_PHRASE[phrase],
    })

if not milestones:
    raise ValueError(config.PROCEDURE_UNREAD_MESSAGE)`} />
          <Callout tone="rose" icon={Ban} title="Zero hardcoding rule">
            No procedure deadline appears in code or config. Config holds only the patterns and the two clock-start phrases. A hardcoded number that happens to match still counts as wrong.
          </Callout>
        </div>
      </div>

      <div className="card p-6">
        <h4 className="font-semibold text-white">The 16 documents</h4>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {DOCS16.map((d) => (
            <div key={d.name} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] ${d.group === 'Restricted' ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
              {d.group === 'Restricted' ? <Lock size={13} className="shrink-0 text-rose-400" /> : <FileText size={13} className={`shrink-0 ${d.group === 'Procedure' ? 'text-cyan-400' : d.group === 'Playbook' ? 'text-violet-400' : 'text-slate-500'}`} />}
              <span className="truncate font-mono text-slate-300" title={d.name}>{d.name}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500"><Lock size={11} className="inline text-rose-400" /> The casebook is excluded from chat (<span className="code">CHAT_EXCLUDED_DOCUMENTS</span>): it records which incidents went to a regulator without customers being told.</p>
      </div>
    </div>
  )
}

function PillarTools() {
  const tools = [
    { t: 'select_applicable_procedures', d: 'Three independent tests; grounds per code; campaign-only significance flag.' },
    { t: 'compute_procedure_deadlines', d: 'Start = incident value of the reading’s column; due = start + hours read from the PDF.' },
    { t: 'compare_effort_with_deadline', d: 'hours_available = hours_remaining − FILING_RESERVE_HOURS; fits only if effort ≤ available.' },
    { t: 'estimate_containment_effort', d: 'Containment planned at snapshot in hub time; ×SENSITIVE_DATA_EFFORT_MULTIPLIER once.' },
    { t: 'compute_final_report_due', d: 'filing_submitted_at + N calendar months; earliest across procedures, else None.' },
    { t: 'rank_incident_queue', d: 'Running clocks first, nearest (overdue = nearest); then no-clock by harm probability.' },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {tools.map((x) => (
          <div key={x.t} className="card card-hover p-4">
            <div className="font-mono text-sm text-amber-300">{x.t}()</div>
            <p className="mt-1 text-sm text-slate-400">{x.d}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <CodeBlock title="tools/deadline_tools.py (shape)" code={`snapshot = parse_utc(config.SNAPSHOT_AT_UTC)   # never datetime.now()

for code, reading in procedure_readings.items():
    for m in reading["milestones"]:
        started = incident_profile.get(m["clock_start_column"])
        if not started:                       # awaiting confirmation
            line = {..., "clock_started": False,
                    "status": config.CLOCK_NOT_STARTED_MESSAGE}
        else:
            due = parse_utc(started) + timedelta(hours=m["hours"])
            left = (due - snapshot).total_seconds() / 3600
            line = {..., "clock_started": True,
                    "hours_remaining": round(left, 2),
                    "overdue": left <= 0}     # nought is overdue

running = [l for l in lines if l["clock_started"]]
earliest = min(running, key=lambda l: l["hours_remaining"], default=None)`} />
        <Callout tone="amber" icon={Calculator} title="Calculations finish before the prompt">
          Hours remaining, campaign sums, the sensitive-data multiplier and the earliest deadline are all settled in pure Python before any prompt is built. Agents receive them as finished facts. This is the <Term k="boundary" />.
        </Callout>
      </div>
    </div>
  )
}

function PillarAgents() {
  const rows = [
    ['RECORD ONLY', '5 + 0', 5, 'RECORDED', 'emerald'],
    ['NOTIFY REGULATOR', '5 + 1', 6, 'NOTIFIED', 'amber'],
    ['NOTIFY REGULATOR AND CUSTOMERS', '5 + 2', 7, 'NOTIFIED_AND_DISCLOSED', 'rose'],
  ]
  const tone = { emerald: 'text-emerald-300', amber: 'text-amber-300', rose: 'text-rose-300' }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <h4 className="font-semibold text-white">Five pre-gate agents, one call each</h4>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          {['Intake Planner', 'Harm Analyst', 'Attack Analyst', 'Reporting Duty Advisor', 'Incident Writer'].map((a, i, arr) => (
            <span key={a} className="flex items-center gap-2"><span className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1.5 text-violet-200">{a}</span>{i < arr.length - 1 && <ArrowRight size={14} className="text-slate-600" />}</span>
          ))}
          <ArrowRight size={14} className="text-slate-600" />
          <span className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-amber-200"><PauseCircle size={14} />DPO Gate</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-400">
          <Term k="gate" />: a LangGraph <span className="code">interrupt()</span> with a SQLite checkpointer at <span className="code">database/checkpoint.db</span>. The process can be killed while it waits, and the DPO's decision resumes the same thread later.
        </p>
        <a href="#workflow" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200">Open the interactive workflow <ArrowRight size={14} /></a>
      </div>
      <div className="card overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4"><h4 className="font-semibold text-white">Call budget: a hard audit cap</h4></div>
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-2 font-medium">Disposition</th><th className="px-2 py-2 font-medium">Calls</th><th className="px-6 py-2 font-medium">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map(([d, f, n, s, c]) => (
              <tr key={d}><td className={`px-6 py-3 font-medium ${tone[c]}`}>{d}</td><td className="px-2 py-3 font-mono text-slate-300">{f} = <b className="text-white">{n}</b></td><td className="px-6 py-3 font-mono text-xs text-slate-400">{s}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="px-6 py-4 text-xs text-slate-500"><span className="code">GET /incidents/&#123;id&#125;/calls</span> compares <span className="code">call_count</span> with <span className="code">expected_call_count</span>, so a run that spent the wrong number of calls shows up at a glance.</p>
      </div>
    </div>
  )
}

export default function Architecture() {
  const [tab, setTab] = useState('data')
  const tabs = [
    { id: 'data', label: '1 · Data & Models', icon: Database },
    { id: 'rag', label: '2 · Knowledge Base', icon: Library },
    { id: 'tools', label: '3 · Deterministic Tools', icon: Calculator },
    { id: 'agents', label: '4 · Agents & Gate', icon: Workflow },
  ]
  return (
    <Section id="architecture" kicker="Solution" title="Four-pillar architecture" lead="Each pillar hands finished facts to the next. By the time a language model is involved, nothing is left to calculate.">
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <div key={tab} className="mt-6 animate-fadeIn">
        {tab === 'data' && <PillarData />}
        {tab === 'rag' && <PillarRag />}
        {tab === 'tools' && <PillarTools />}
        {tab === 'agents' && <PillarAgents />}
      </div>
    </Section>
  )
}
