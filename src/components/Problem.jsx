import { useState } from 'react'
import { Clock3, Layers, Network, Bug, Landmark, AlertTriangle, CheckCircle2, Pause, Play, Search } from 'lucide-react'
import { PROCEDURES, DEFECTS, HUBS } from '../data'
import { Section, Term, Callout } from './ui'

const COLOR = {
  cyan: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
  amber: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
  violet: 'border-violet-500/30 text-violet-300 bg-violet-500/10',
}

function ClockStartDemo() {
  const [confirmed, setConfirmed] = useState(true)
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-semibold text-white"><Clock3 size={18} className="text-cyan-400" />Clocks start from different moments</h3>
        <div className="flex rounded-lg border border-slate-800 p-0.5 text-xs">
          {[[true, 'Confirmed'], [false, 'Awaiting confirmation']].map(([v, l]) => (
            <button key={l} onClick={() => setConfirmed(v)} className={`rounded-md px-3 py-1.5 transition ${confirmed === v ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="relative mt-8 h-16">
        <div className="absolute inset-x-0 top-6 h-px bg-slate-700" />
        {[
          { x: '6%', l: 'first_alert_at', c: 'bg-cyan-400', show: true },
          { x: '42%', l: 'confirmed_at (awareness)', c: 'bg-violet-400', show: confirmed },
          { x: '88%', l: 'SNAPSHOT', c: 'bg-amber-400', show: true },
        ].map((m) => (
          <div key={m.l} className="absolute top-0 -translate-x-1/2 text-center transition-opacity" style={{ left: m.x, opacity: m.show ? 1 : 0.25 }}>
            <div className="font-mono text-[10px] text-slate-500 whitespace-nowrap">{m.show ? m.l : 'not recorded'}</div>
            <div className={`mx-auto mt-1.5 h-3 w-3 rounded-full ring-4 ring-slate-950 ${m.c}`} />
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <ClockBar label={<>Milestone counted from <Term k="firstAlert" /></>} running from="6%" color="from-cyan-500/70 to-cyan-400" />
        <ClockBar label={<>Milestone counted from <Term k="awareness" /></>} running={confirmed} from="42%" color="from-violet-500/70 to-violet-400" />
      </div>
      <p className="mt-5 text-sm text-slate-400">
        {confirmed
          ? 'Both clocks are running. The earliest running deadline across all applicable procedures governs the work.'
          : 'No awareness moment exists yet, so that milestone has no due time and no hours remaining (CLOCK_NOT_STARTED_MESSAGE). The first-alert clock is already running.'}
      </p>
    </div>
  )
}

function ClockBar({ label, running, from, color }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={`flex items-center gap-1 font-medium ${running ? 'text-emerald-400' : 'text-slate-500'}`}>{running ? <><Play size={11} />running</> : <><Pause size={11} />not started</>}</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-slate-800">
        {running && <div className={`absolute inset-y-0 rounded-full bg-gradient-to-r ${color} transition-all duration-500`} style={{ left: from, right: '12%' }} />}
      </div>
    </div>
  )
}

function CampaignDemo() {
  const THRESHOLD = 10000 // illustrative — real value is config.SIGNIFICANT_CUSTOMERS_ACROSS_CAMPAIGN
  const [vals, setVals] = useState([3200, 2800, 2600, 2100])
  const total = vals.reduce((a, b) => a + b, 0)
  const anyAlone = vals.some((v) => v > THRESHOLD)
  const crosses = total > THRESHOLD
  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-2 font-semibold text-white"><Network size={18} className="text-amber-400" />The campaign trap</h3>
      <p className="mt-1 text-sm text-slate-400">Four incidents share <span className="code">CMP-2026-0412</span>. Drag the sliders: none is significant alone, but together they can be. This is <Term k="campaign" />.</p>
      <div className="mt-5 space-y-4">
        {vals.map((v, i) => (
          <div key={i}>
            <div className="mb-1 flex justify-between font-mono text-xs"><span className="text-slate-400">INC-{HUBS[i].code}-00{4110 + i}</span><span className={v > THRESHOLD ? 'text-rose-300' : 'text-slate-300'}>{v.toLocaleString()} customers</span></div>
            <input type="range" min={0} max={12000} step={100} value={v} aria-label={`Customers affected in incident ${i + 1}`}
              onChange={(e) => setVals(vals.map((x, j) => (j === i ? +e.target.value : x)))} className="w-full accent-amber-400" />
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-500">customers_across_campaign</span>
          <span className={`font-mono text-xl font-bold ${crosses ? 'text-rose-300' : 'text-emerald-300'}`}>{total.toLocaleString()}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className={`h-full transition-all ${crosses ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, (total / (THRESHOLD * 2)) * 100)}%` }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-500"><span>0</span><span>threshold (illustrative {THRESHOLD.toLocaleString()})</span><span>{(THRESHOLD * 2).toLocaleString()}</span></div>
        <div className="mt-3 text-sm">
          {crosses && !anyAlone && <span className="flex items-center gap-2 text-amber-300"><AlertTriangle size={15} />significant_only_with_campaign = true. Procedure 02 applies because of the campaign.</span>}
          {crosses && anyAlone && <span className="flex items-center gap-2 text-rose-300"><AlertTriangle size={15} />Significant: at least one incident crosses on its own.</span>}
          {!crosses && <span className="flex items-center gap-2 text-emerald-300"><CheckCircle2 size={15} />Below the threshold, even across the campaign.</span>}
        </div>
      </div>
    </div>
  )
}

export default function Problem() {
  const [q, setQ] = useState('')
  const defects = DEFECTS.filter((d) => (d.name + d.before + d.cfg).toLowerCase().includes(q.toLowerCase()))
  return (
    <Section id="problem" kicker="The problem" title='The "multi-clock & threshold" nightmare'
      lead="The queue is bigger than the desk, so the incident that reaches the DPO isn't always the one that deserved to. And the clock everybody remembers is almost never the one that comes due first.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { i: Clock3, t: 'Fragmented time zones', d: 'Four hubs write timestamps in their own UTC offset, against one fixed extraction snapshot.' },
          { i: Layers, t: 'Overlapping clocks', d: 'Three procedures, three authorities, different lengths. An incident can fall under one, two, all three or none.' },
          { i: Network, t: 'The campaign trap', d: 'Incidents that look minor alone can cross a threshold once their shared campaign is counted.' },
          { i: Bug, t: 'Dirty extracts', d: 'Four timestamp notations, "1.11 lakh", "€105,114", backward timelines, shouted notes with HTML.' },
        ].map(({ i: I, t, d }) => (
          <div key={t} className="card card-hover p-5">
            <I size={22} className="text-cyan-400" />
            <h3 className="mt-3 font-semibold text-white">{t}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{d}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-14 flex items-center gap-2 text-xl font-semibold text-white"><Landmark size={20} className="text-cyan-400" />Three procedures, three clocks</h3>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {PROCEDURES.map((p) => (
          <div key={p.code} className="card card-hover flex flex-col p-6">
            <div className="flex items-center justify-between">
              <span className={`chip ${COLOR[p.color]}`}>{p.short}</span>
              <span className="text-xs text-slate-500">{p.tag}</span>
            </div>
            <h4 className="mt-3 text-lg font-semibold text-white">{p.title}</h4>
            <p className="text-sm text-slate-400">Report to <span className="font-medium text-slate-200">{p.authority}</span></p>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Applies when</div>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
              {p.applies.map((a) => <li key={a} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" />{a}</li>)}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">{p.extra}</p>
            <div className="mt-auto pt-4 font-mono text-[11px] text-slate-500">{p.doc}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-500">Each test is independent and is met by <em>exceeding</em> its threshold, not by equalling it.</p>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <ClockStartDemo />
        <CampaignDemo />
      </div>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-semibold text-white"><Bug size={20} className="text-amber-400" />Defects in the raw extracts</h3>
          <p className="mt-1 text-sm text-slate-400">Nothing downstream may assume a clean table. Every repair value lives in <span className="code">config/config.py</span>.</p>
        </div>
        <label className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter defects…" className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none" />
        </label>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {defects.map((d) => (
          <div key={d.name} className="card card-hover p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-slate-100">{d.name}</span>
              <span className="truncate font-mono text-[10px] text-slate-500">{d.cfg}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5"><div className="mb-1 text-[10px] font-semibold uppercase text-rose-400">Arrives as</div><span className="font-mono text-slate-300 break-words">{d.before}</span></div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5"><div className="mb-1 text-[10px] font-semibold uppercase text-emerald-400">Leaves as</div><span className="font-mono text-slate-300 break-words">{d.after}</span></div>
            </div>
          </div>
        ))}
        {defects.length === 0 && <p className="text-sm text-slate-500">No defect matches "{q}".</p>}
      </div>
      <div className="mt-6">
        <Callout tone="amber" icon={AlertTriangle} title="Note on the stakes">
          A missed deadline is a reportable compliance failure on the record a regulator reads at inspection. A needless filing tells three authorities about an incident that never touched a customer. Both errors cost something.
        </Callout>
      </div>
    </Section>
  )
}
