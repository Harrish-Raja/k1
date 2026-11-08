import { useState } from 'react'
import { Clock3, Layers, Network, Bug, Landmark, AlertTriangle, CheckCircle2, Pause, Play, Search } from 'lucide-react'
import { PROCEDURES, DEFECTS, HUBS } from '../data'
import { Section, Term, Callout } from './ui'
import { Tech } from '../mode'

const COLOR = {
  cyan: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
  amber: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
  violet: 'border-violet-500/30 text-violet-300 bg-violet-500/10',
}

function ClockStartDemo() {
  const [confirmed, setConfirmed] = useState(true)
  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-2 font-semibold text-white"><Clock3 size={18} className="text-cyan-400" />Deadlines start at different moments</h3>
      <p className="mt-1 text-sm text-slate-400">Some deadlines start when the <Term k="firstAlert">first alarm</Term> goes off. Others start only when an analyst <Term k="awareness">confirms</Term> the incident is real. Try both:</p>
      <div className="mt-4 flex rounded-lg border border-slate-800 p-0.5 text-xs sm:w-fit">
        {[[true, 'Analyst has confirmed it'], [false, 'Not confirmed yet']].map(([v, l]) => (
          <button key={l} onClick={() => setConfirmed(v)} className={`flex-1 rounded-md px-3 py-1.5 transition ${confirmed === v ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}>{l}</button>
        ))}
      </div>
      <div className="relative mt-8 h-16">
        <div className="absolute inset-x-0 top-6 h-px bg-slate-700" />
        {[
          { x: '8%', l: 'Alarm', c: 'bg-cyan-400', show: true },
          { x: '42%', l: 'Confirmed', c: 'bg-violet-400', show: confirmed },
          { x: '88%', l: 'Now', c: 'bg-amber-400', show: true },
        ].map((m) => (
          <div key={m.l} className="absolute top-0 -translate-x-1/2 text-center transition-opacity" style={{ left: m.x, opacity: m.show ? 1 : 0.25 }}>
            <div className="whitespace-nowrap text-[11px] text-slate-400">{m.show ? m.l : 'not yet'}</div>
            <div className={`mx-auto mt-1.5 h-3 w-3 rounded-full ring-4 ring-slate-950 ${m.c}`} />
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <ClockBar label="Deadline that counts from the alarm" running from="8%" color="from-cyan-500/70 to-cyan-400" />
        <ClockBar label="Deadline that counts from confirmation" running={confirmed} from="42%" color="from-violet-500/70 to-violet-400" />
      </div>
      <p className="mt-5 rounded-lg bg-slate-950/60 p-3 text-sm text-slate-300">
        {confirmed
          ? 'Both stopwatches are running. Whichever deadline is due first is the one that matters most.'
          : 'Nobody has confirmed it yet, but the first stopwatch is already running. Waiting to confirm does not stop every clock.'}
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
  const LIMIT = 10000 // illustrative — the real limit is in the settings
  const [vals, setVals] = useState([3200, 2800, 2600, 2100])
  const total = vals.reduce((a, b) => a + b, 0)
  const anyAlone = vals.some((v) => v > LIMIT)
  const crosses = total > LIMIT
  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-2 font-semibold text-white"><Network size={18} className="text-amber-400" />Small incidents can add up</h3>
      <p className="mt-1 text-sm text-slate-400">These four incidents are all part of the <Term k="campaign">same attack</Term>. Each one alone looks small, but the law counts them together. Move the sliders:</p>
      <div className="mt-5 space-y-4">
        {vals.map((v, i) => (
          <div key={i}>
            <div className="mb-1 flex justify-between text-xs"><span className="text-slate-400">Incident {i + 1} ({HUBS[i].name})</span><span className={v > LIMIT ? 'text-rose-300' : 'text-slate-300'}>{v.toLocaleString()} customers</span></div>
            <input type="range" min={0} max={12000} step={100} value={v} aria-label={`Customers affected in incident ${i + 1}`}
              onChange={(e) => setVals(vals.map((x, j) => (j === i ? +e.target.value : x)))} className="w-full accent-amber-400" />
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-slate-500">Total customers across the attack</span>
          <span className={`font-mono text-xl font-bold ${crosses ? 'text-rose-300' : 'text-emerald-300'}`}>{total.toLocaleString()}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className={`h-full transition-all ${crosses ? 'bg-rose-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, (total / (LIMIT * 2)) * 100)}%` }} />
        </div>
        <div className="mt-1 text-center text-[10px] text-slate-500">"big incident" limit (example: {LIMIT.toLocaleString()})</div>
        <div className="mt-3 text-sm">
          {crosses && !anyAlone && <span className="flex items-center gap-2 text-amber-300"><AlertTriangle size={15} />None is big alone, but together they cross the limit, so the "big incident" rule applies.</span>}
          {crosses && anyAlone && <span className="flex items-center gap-2 text-rose-300"><AlertTriangle size={15} />At least one incident is over the limit by itself.</span>}
          {!crosses && <span className="flex items-center gap-2 text-emerald-300"><CheckCircle2 size={15} />Still under the limit, even when added together.</span>}
        </div>
      </div>
    </div>
  )
}

export default function Problem() {
  const [q, setQ] = useState('')
  const defects = DEFECTS.filter((d) => (d.name + d.before + d.cfg).toLowerCase().includes(q.toLowerCase()))
  return (
    <Section id="problem" kicker="The problem" title="Why this is hard"
      lead="Four things make it easy to miss a deadline or report something that didn't need reporting.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { i: Clock3, t: 'Different time zones', d: 'Four offices each write times in their own local time. Comparing them is easy to get wrong.' },
          { i: Layers, t: 'Three laws, three stopwatches', d: 'One incident can fall under one, two, all three or none of the laws, each with its own deadline.' },
          { i: Network, t: 'Small incidents add up', d: 'Several small incidents from the same attack can together be big enough to report.' },
          { i: Bug, t: 'Messy data', d: 'Dates written four ways, numbers like "1.11 lakh", notes full of leftover web code.' },
        ].map(({ i: I, t, d }) => (
          <div key={t} className="card card-hover p-5">
            <I size={22} className="text-cyan-400" />
            <h3 className="mt-3 font-semibold text-white">{t}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{d}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-14 flex items-center gap-2 text-xl font-semibold text-white"><Landmark size={20} className="text-cyan-400" />The three laws (rulebooks)</h3>
      <p className="mt-1 text-sm text-slate-400">Each is a PDF document the company must follow. Each says who to tell, what to send, and how quickly.</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {PROCEDURES.map((p) => (
          <div key={p.code} className="card card-hover flex flex-col p-6">
            <div className="flex items-center justify-between">
              <span className={`chip ${COLOR[p.color]}`}>{p.short}</span>
              <span className="text-xs text-slate-500">{p.tag}</span>
            </div>
            <h4 className="mt-3 text-lg font-semibold text-white">{p.title}</h4>
            <p className="mt-1 text-sm text-slate-400">Tell: <span className="text-slate-200">{p.authority}</span></p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{p.plain}</p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{p.extra}</p>
            <Tech>
              <ul className="mt-4 space-y-1 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 font-mono text-[11px] text-amber-200/90">
                {p.applies.map((a) => <li key={a}>{a}</li>)}
              </ul>
              <div className="mt-2 font-mono text-[11px] text-slate-500">{p.doc}</div>
            </Tech>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-500">The deadlines themselves are not written on this site or in the software. They are read straight from each PDF.</p>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <ClockStartDemo />
        <CampaignDemo />
      </div>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-semibold text-white"><Bug size={20} className="text-amber-400" />How messy is the data?</h3>
          <p className="mt-1 text-sm text-slate-400">Real examples of problems in the spreadsheets, and what BreachWatch turns them into.</p>
        </div>
        <label className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search problems…" className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none" />
        </label>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {defects.map((d) => (
          <div key={d.name} className="card card-hover p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-slate-100">{d.name}</span>
              <Tech><span className="truncate font-mono text-[10px] text-slate-500">{d.cfg}</span></Tech>
            </div>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5"><div className="mb-1 text-[10px] font-semibold uppercase text-rose-400">Before</div><span className="break-words text-slate-300">{d.before}</span></div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5"><div className="mb-1 text-[10px] font-semibold uppercase text-emerald-400">After</div><span className="break-words text-slate-300">{d.after}</span></div>
            </div>
          </div>
        ))}
        {defects.length === 0 && <p className="text-sm text-slate-500">Nothing matches "{q}".</p>}
      </div>
      <div className="mt-6">
        <Callout tone="amber" icon={AlertTriangle} title="Why it matters">
          Report too late: a legal failure that regulators will see at inspection. Report when it wasn't needed: authorities are told about something that never affected a customer. Both are costly.
        </Callout>
      </div>
    </Section>
  )
}
