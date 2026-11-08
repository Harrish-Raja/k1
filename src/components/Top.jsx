import { useEffect, useState } from 'react'
import { Shield, Menu, X, Brain, Library, Calculator, UserCheck, ArrowRight, Clock, Globe2 } from 'lucide-react'
import { HUBS, SNAPSHOT_AT_UTC } from '../data'
import { Term } from './ui'

const LINKS = [
  ['problem', 'Problem'], ['architecture', 'Architecture'], ['workflow', 'Workflow'],
  ['rbac', 'Access'], ['explorer', 'Explorer'], ['pipeline', 'Pipeline'], ['decisions', 'Decisions'],
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/15 ring-1 ring-cyan-500/40"><Shield size={17} className="text-cyan-400" /></span>
          BreachWatch <span className="text-cyan-400">AI</span>
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([id, l]) => (
            <a key={id} href={`#${id}`} className={`rounded-lg px-3 py-1.5 text-sm transition ${active === id ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'}`}>{l}</a>
          ))}
        </div>
        <button className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
      </nav>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 animate-fadeIn border-l border-slate-800 bg-slate-950 p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold text-white">Navigate</span>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Close menu"><X size={20} /></button>
            </div>
            {LINKS.map(([id, l]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-slate-300 hover:bg-slate-900 hover:text-cyan-300">{l}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function fmt(tz) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'shortOffset' }).format(new Date(SNAPSHOT_AT_UTC))
}

export function Hero() {
  const stats = [['9M', 'customer accounts'], ['60K', 'sellers'], ['4', 'SOC hubs, 24×7'], ['3', 'reporting procedures'], ['16', 'governing PDFs'], ['5·6·7', 'LLM calls per run']]
  const flow = [
    { icon: Calculator, t: 'Compute', d: 'Deterministic tools & trained ML models establish every fact — bands, deadlines, sums, effort.', c: 'cyan' },
    { icon: Brain, t: 'Interpret', d: 'A LangGraph multi-agent workflow turns those facts into prose. One call per agent, no maths.', c: 'violet' },
    { icon: UserCheck, t: 'Decide', d: 'A mandatory human gate. Nothing is filed and no customer is told without the DPO.', c: 'amber' },
  ]
  const ring = { cyan: 'text-cyan-400 bg-cyan-500/10 ring-cyan-500/30', violet: 'text-violet-400 bg-violet-500/10 ring-violet-500/30', amber: 'text-amber-400 bg-amber-500/10 ring-amber-500/30' }
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="chip border-cyan-500/30 bg-cyan-500/10 text-cyan-300"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-cyan-400" />Merrowfield Digital · Security Operations</span>
        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          BreachWatch <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="mt-4 max-w-3xl text-xl font-medium text-slate-200 sm:text-2xl">
          Autonomous incident triage with <span className="text-cyan-300">deterministic compliance</span> and <span className="text-amber-300">human-in-the-loop governance</span>.
        </p>
        <p className="lead">
          A marketplace with nine million accounts across the EU and India. Four hubs record what they see in their own local time. Most alerts are nothing, but a real incident can start several legal reporting clocks at once, each with a different length, starting moment and authority. Miss one and it's a compliance failure on the record; file when nothing was required and three authorities hear about an incident that never touched a customer.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#architecture" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Explore the architecture <ArrowRight size={16} /></a>
          <a href="#workflow" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300">See the agent workflow</a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(([v, l]) => (
            <div key={l} className="card card-hover p-4">
              <div className="text-2xl font-bold text-white">{v}</div>
              <div className="mt-1 text-xs text-slate-500">{l}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {flow.map(({ icon: I, t, d, c }, i) => (
            <div key={t} className="card card-hover relative p-6">
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${ring[c]}`}><I size={20} /></span>
                <span className="font-mono text-xs text-slate-500">STEP 0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          The core idea is the <Term k="boundary" />: language models never compute deadlines, count affected people, or decide what must be reported.
        </p>

        <div className="card mt-10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><Clock size={16} className="text-cyan-400" /> One snapshot, four local clocks</div>
            <span className="font-mono text-xs text-slate-500">SNAPSHOT_AT_UTC = {SNAPSHOT_AT_UTC}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HUBS.map((h) => (
              <div key={h.code} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium text-slate-100"><Globe2 size={15} className="text-teal-400" />{h.name}</span>
                  <span className="chip border-slate-700 text-slate-400">INC-{h.code}</span>
                </div>
                <div className="mt-2 font-mono text-sm text-cyan-300">{fmt(h.tz)}</div>
                <div className="mt-0.5 text-xs text-slate-500">{h.tz}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Hours remaining are measured from this snapshot. See <Term k="snapshot" />.</p>
        </div>
      </div>
    </section>
  )
}
