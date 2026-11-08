import { useState } from 'react'
import { Database, Library, Calculator, Workflow, ShieldAlert, Timer, FileSearch, FileText, Scissors, Boxes, Filter, XCircle, CheckCircle2, ArrowRight, Lock, Ban, PauseCircle, Search } from 'lucide-react'
import { MODELS, DATASETS, DOCS16, PROCEDURES, ATTACK_TYPES, DECISIONS } from '../data'
import { Section, Tabs, CodeBlock, Callout, Term } from './ui'
import { Tech, Plain } from '../mode'

const ICONS = { ShieldAlert, Timer, FileSearch }

function Intro({ children }) {
  return <p className="mb-6 max-w-3xl text-base leading-relaxed text-slate-300">{children}</p>
}

function PillarData() {
  const [m, setM] = useState('harm')
  const model = MODELS.find((x) => x.id === m)
  const Icon = ICONS[model.icon]
  return (
    <div>
      <Intro>First the messy spreadsheets are cleaned up. Then three models <b className="text-white">learn from thousands of past incidents</b> so they can make quick, consistent estimates about new ones, much like an experienced analyst would.</Intro>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card p-6 lg:col-span-2">
          <h4 className="font-semibold text-white">Cleaning: how many rows survived</h4>
          <p className="mt-1 text-xs text-slate-500">Rows removed were exact duplicates, rows with no answer to learn from, or notes too short to be useful.</p>
          <div className="mt-5 space-y-4">
            {DATASETS.map((d) => {
              const pct = (d.kept / d.received) * 100
              return (
                <div key={d.key}>
                  <div className="mb-1 flex justify-between text-xs"><span className="text-slate-300">{d.name}</span><span className="text-slate-500">{d.kept.toLocaleString()} of {d.received.toLocaleString()}</span></div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="bg-teal-400" style={{ width: `${pct}%` }} /><div className="bg-rose-400/70" style={{ width: `${100 - pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex gap-4 text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-teal-400" />kept</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-rose-400/70" />removed</span></div>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">Every problem found and fixed is counted in a quality report, so anyone can check the cleaning was done properly.<Tech> <span className="code">output/data_quality_report.json</span></Tech></p>
        </div>
        <div className="card p-6 lg:col-span-3">
          <Tabs size="sm" active={m} onChange={setM} tabs={MODELS.map((x) => ({ id: x.id, label: x.name, icon: ICONS[x.icon] }))} />
          <div key={m} className="mt-5 animate-fadeIn">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"><Icon size={22} /></span>
              <div>
                <h4 className="text-lg font-semibold text-white">{model.name}</h4>
                <p className="text-sm text-cyan-300">"{model.question}"</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">{model.plain}</p>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Common-sense checks it must pass</div>
            <ul className="mt-2 grid gap-1.5 text-sm text-slate-300 sm:grid-cols-2">
              {model.checks.map((c) => <li key={c} className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />{c}</li>)}
            </ul>
            {m === 'attack' && <div className="mt-4 flex flex-wrap gap-1.5">{ATTACK_TYPES.map((t) => <span key={t} className="chip border-violet-500/30 bg-violet-500/10 text-violet-300">{t}</span>)}</div>}
            <Tech>
              <dl className="mt-5 grid gap-3 text-xs sm:grid-cols-3">
                {[['Type', model.tech.kind], ['Target', model.tech.target], ['Pass mark', model.tech.gate]].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"><dt className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">{k}</dt><dd className="mt-1 font-mono text-slate-200">{v}</dd></div>
                ))}
              </dl>
              <div className="mt-3 flex flex-wrap gap-1.5">{model.tech.metrics.map((x) => <span key={x} className="chip border-slate-700 font-mono text-slate-400">{x}</span>)}</div>
            </Tech>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Callout tone="cyan" icon={CheckCircle2} title="Tested on data it has never seen">
          Each model is scored on a separate set of incidents kept aside during training, so we know it learned real patterns rather than memorising answers. Each has a minimum score it must reach.
        </Callout>
      </div>
    </div>
  )
}

function PillarRag() {
  const [isolated, setIsolated] = useState(true)
  const steps = [
    { i: FileText, t: 'Read', d: 'Pull the text out of all 16 PDFs' },
    { i: Scissors, t: 'Cut', d: 'Split into short passages, never mid-rule' },
    { i: Boxes, t: 'Index', d: 'Make passages searchable by meaning' },
    { i: Filter, t: 'Narrow', d: 'Search only the one PDF that matters' },
    { i: Search, t: 'Extract', d: 'Read the deadline from the sentence' },
  ]
  return (
    <div>
      <Intro>The company's 16 PDF documents are the <b className="text-white">only source of truth</b>. Deadlines are not typed into the software. When the system needs a deadline, it looks it up in the right PDF and reads it from the text, like a person checking the rulebook.</Intro>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {steps.map(({ i: I, t, d }, k) => (
          <div key={t} className="card card-hover p-4">
            <span className="font-mono text-[10px] text-slate-600">STEP {k + 1}</span>
            <I size={18} className="mt-1 text-violet-400" />
            <div className="mt-2 text-sm font-semibold text-white">{t}</div>
            <div className="text-xs text-slate-500">{d}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h4 className="font-semibold text-white">Why look in only one PDF?</h4>
          <p className="mt-1 text-sm text-slate-400">The three rulebooks were written from the same template, so many sentences are identical. Ask "what is India's deadline?" and compare:</p>
          <div className="mt-4 flex rounded-lg border border-slate-800 p-0.5 text-xs sm:w-fit">
            <button onClick={() => setIsolated(false)} className={`flex-1 rounded-md px-3 py-1.5 ${!isolated ? 'bg-rose-500/15 text-rose-300' : 'text-slate-400'}`}>Search all PDFs</button>
            <button onClick={() => setIsolated(true)} className={`flex-1 rounded-md px-3 py-1.5 ${isolated ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-400'}`}>Search India PDF only</button>
          </div>
          <div className="mt-4 space-y-2">
            {(isolated
              ? [[PROCEDURES[2], true], [PROCEDURES[2], true], [PROCEDURES[2], true]]
              : [[PROCEDURES[0], false], [PROCEDURES[2], true], [PROCEDURES[1], false]]
            ).map(([p, ok], i) => (
              <div key={i} className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${ok ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
                {ok ? <CheckCircle2 size={15} className="shrink-0 text-emerald-400" /> : <XCircle size={15} className="shrink-0 text-rose-400" />}
                <span className="text-slate-300">Result {i + 1}: passage from the <b>{p.title}</b> rulebook</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-300">
            {isolated
              ? 'Every answer comes from the India rulebook. Correct.'
              : 'The top answer is from the EU rulebook, so India’s deadline would be read wrongly. It looks confident but it’s the wrong law.'}
          </p>
        </div>
        <div className="space-y-4">
          <Callout tone="rose" icon={Ban} title="Golden rule: no deadlines in the code">
            The software never contains a deadline number. If a rulebook changes, the new deadline is picked up automatically. If a rulebook can't be read, the system stops with an error instead of guessing.
          </Callout>
          <Plain>
            <Callout tone="cyan" icon={Lock} title="One document is off-limits to the chat">
              The past-cases casebook records which incidents were reported without telling customers. That is confidential, so the chat assistant never reads it.
            </Callout>
          </Plain>
          <Tech>
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
        "clock_start_column": config.CLOCK_START_COLUMN_BY_PHRASE[phrase],
    })

if not milestones:
    raise ValueError(config.PROCEDURE_UNREAD_MESSAGE)`} />
          </Tech>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h4 className="font-semibold text-white">The 16 documents</h4>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {DOCS16.map((d) => (
            <div key={d.name} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${d.group === 'Restricted' ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
              {d.group === 'Restricted' ? <Lock size={13} className="shrink-0 text-rose-400" /> : <FileText size={13} className={`shrink-0 ${d.group === 'Procedure' ? 'text-cyan-400' : d.group === 'Playbook' ? 'text-violet-400' : 'text-slate-500'}`} />}
              <span className="min-w-0">
                <span className="block truncate text-slate-200">{d.plain}</span>
                <Tech><span className="block truncate font-mono text-[10px] text-slate-500" title={d.name}>{d.name}</span></Tech>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5"><FileText size={11} className="text-cyan-400" />rulebooks</span>
          <span className="flex items-center gap-1.5"><FileText size={11} className="text-slate-500" />company policies</span>
          <span className="flex items-center gap-1.5"><FileText size={11} className="text-violet-400" />playbooks (what to do per attack type)</span>
          <span className="flex items-center gap-1.5"><Lock size={11} className="text-rose-400" />confidential</span>
        </div>
      </div>
    </div>
  )
}

function PillarTools() {
  const tools = [
    { t: 'Which laws apply?', d: 'Checks the three rulebooks’ conditions one by one and writes down why each one applies.', fn: 'select_applicable_procedures' },
    { t: 'When is each deadline?', d: 'Start time + the hours from the PDF = due time. Then counts the hours left from the snapshot moment.', fn: 'compute_procedure_deadlines' },
    { t: 'Which deadline comes first?', d: 'Picks the earliest running deadline across every law. That one sets the pace.', fn: 'compute_procedure_deadlines' },
    { t: 'Is there enough time?', d: 'Hours left, minus a small filing buffer, compared with the hours the work will take.', fn: 'compare_effort_with_deadline' },
    { t: 'When is the final report due?', d: 'Counted in months from the day the first report was actually sent.', fn: 'compute_final_report_due' },
    { t: 'What should we work on first?', d: 'Sorts the whole list: nearest deadline first (overdue at the very top), then the rest by risk.', fn: 'rank_incident_queue' },
  ]
  return (
    <div>
      <Intro>All calculations are done by <b className="text-white">ordinary, predictable code</b>. Give it the same incident and it gives exactly the same answer every time, so an auditor can check it. Only the finished answers are passed to the AI.</Intro>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {tools.map((x) => (
            <div key={x.t} className="card card-hover p-4">
              <div className="font-semibold text-amber-300">{x.t}</div>
              <p className="mt-1 text-sm text-slate-400">{x.d}</p>
              <Tech><div className="mt-1 font-mono text-[11px] text-slate-500">{x.fn}()</div></Tech>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="card p-6">
            <h4 className="font-semibold text-white">Worked example (made-up numbers)</h4>
            <div className="mt-4 space-y-2 font-mono text-sm">
              {[
                ['Deadline due', 'Thu 14:00'],
                ['Snapshot time', 'Thu 02:00'],
                ['Hours left', '12.0 h'],
                ['Filing buffer', '− 2.0 h'],
                ['Time available', '10.0 h'],
                ['Work needed (with sensitive-data extra)', '13.5 h'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-slate-800 pb-2"><span className="font-sans text-slate-400">{k}</span><span className="text-slate-100">{v}</span></div>
              ))}
              <div className="flex items-center gap-2 pt-1 font-sans text-rose-300"><XCircle size={16} />Doesn't fit. The briefing will say the desk must handle this one differently.</div>
            </div>
          </div>
          <Tech>
            <CodeBlock title="tools/deadline_tools.py (shape)" code={`snapshot = parse_utc(config.SNAPSHOT_AT_UTC)   # never datetime.now()

for code, reading in procedure_readings.items():
    for m in reading["milestones"]:
        started = incident_profile.get(m["clock_start_column"])
        if not started:                       # awaiting confirmation
            line = {..., "clock_started": False}
        else:
            due = parse_utc(started) + timedelta(hours=m["hours"])
            left = (due - snapshot).total_seconds() / 3600
            line = {..., "hours_remaining": round(left, 2),
                    "overdue": left <= 0}     # zero counts as overdue

earliest = min(running, key=lambda l: l["hours_remaining"], default=None)`} />
          </Tech>
          <Callout tone="amber" icon={Calculator} title="The AI never does maths">
            By the time the AI sees an incident, every number is already worked out. See <Term k="boundary" />.
          </Callout>
        </div>
      </div>
    </div>
  )
}

function PillarAgents() {
  const tone = { emerald: 'text-emerald-300', amber: 'text-amber-300', rose: 'text-rose-300' }
  return (
    <div>
      <Intro>Five AI helpers work like a small team writing a briefing. Each writes <b className="text-white">one part</b>, using only the facts it is given. Then the system <b className="text-white">stops and waits</b> for the Data Protection Officer to decide.</Intro>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h4 className="font-semibold text-white">The five helpers, in order</h4>
          <ol className="mt-4 space-y-2 text-sm">
            {[
              ['Planner', 'What do we need to check?'],
              ['Risk explainer', 'Why is the risk high, medium or low?'],
              ['Attack explainer', 'How sure are we about the attack type?'],
              ['Reporting-duties explainer', 'Who must be told, and by when?'],
              ['Report writer', 'Summary and a recommended action'],
            ].map(([a, q], i) => (
              <li key={a} className="flex items-center gap-3 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-200">{i + 1}</span>
                <span><b className="text-violet-200">{a}</b> <span className="text-slate-400">· {q}</span></span>
              </li>
            ))}
            <li className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2"><PauseCircle size={18} className="text-amber-300" /><span className="text-amber-100"><b>Stop:</b> wait for the Data Protection Officer</span></li>
          </ol>
          <a href="#workflow" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200">See it run step by step <ArrowRight size={14} /></a>
        </div>
        <div className="card overflow-hidden">
          <div className="border-b border-slate-800 px-6 py-4">
            <h4 className="font-semibold text-white">The DPO's three choices</h4>
            <p className="mt-1 text-xs text-slate-500">Each choice uses a fixed number of AI calls, so cost is predictable and checked.</p>
          </div>
          <div className="divide-y divide-slate-800">
            {DECISIONS.map((d) => (
              <div key={d.id} className="px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-semibold ${tone[d.tone]}`}>{d.label}</span>
                  <span className="chip border-slate-700 text-slate-300">{d.calls} AI calls</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{d.plain}</p>
                <Tech><p className="mt-1 font-mono text-[11px] text-slate-500">{d.code} → status {d.status}</p></Tech>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4"><Callout tone="amber" icon={PauseCircle} title="The pause is saved"><Term k="gate" /> If the computer restarts while waiting, nothing is lost.<Tech> (LangGraph interrupt + SQLite checkpointer at <span className="code">database/checkpoint.db</span>.)</Tech></Callout></div>
    </div>
  )
}

export default function Architecture() {
  const [tab, setTab] = useState('data')
  const tabs = [
    { id: 'data', label: '1 · Learn from the past', icon: Database },
    { id: 'rag', label: '2 · Read the rulebooks', icon: Library },
    { id: 'tools', label: '3 · Do the maths', icon: Calculator },
    { id: 'agents', label: '4 · AI helpers + sign-off', icon: Workflow },
  ]
  return (
    <Section id="architecture" kicker="How it works" title="Four building blocks" lead="Each block hands finished facts to the next. By the time AI is involved, there is nothing left to calculate. Click through the four tabs.">
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
