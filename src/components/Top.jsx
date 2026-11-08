import { useEffect, useState } from 'react'
import { Shield, Menu, X, Brain, Calculator, UserCheck, ArrowRight, Clock, Globe2, BookOpen, Code2, Download } from 'lucide-react'

const PDF_URL = './BreachWatch-AI-Project-Overview.pdf'
import { HUBS, SNAPSHOT_AT_UTC } from '../data'
import { Term } from './ui'
import { useMode } from '../mode'

const LINKS = [
  ['story', 'The story'], ['walkthrough', 'Example'], ['problem', 'The problem'], ['architecture', 'How it works'],
  ['workflow', 'AI steps'], ['rbac', 'Who can do what'], ['explorer', 'Code'], ['faq', 'FAQ'],
]

function ModeSwitch({ full }) {
  const { tech, setTech } = useMode()
  return (
    <div className={`flex rounded-lg border border-slate-700 p-0.5 text-xs ${full ? 'w-full' : ''}`} role="group" aria-label="Level of detail">
      <button onClick={() => setTech(false)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition ${!tech ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}><BookOpen size={13} />Plain</button>
      <button onClick={() => setTech(true)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition ${tech ? 'bg-amber-500/15 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}><Code2 size={13} />Technical</button>
    </div>
  )
}

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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2 font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/15 ring-1 ring-cyan-500/40"><Shield size={17} className="text-cyan-400" /></span>
          BreachWatch <span className="text-cyan-400">AI</span>
        </a>
        <div className="hidden items-center gap-0.5 xl:flex">
          {LINKS.map(([id, l]) => (
            <a key={id} href={`#${id}`} className={`rounded-lg px-2.5 py-1.5 text-sm transition ${active === id ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'}`}>{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={PDF_URL} download className="hidden items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-amber-500/50 hover:text-amber-300 md:inline-flex" title="Download the project overview as a PDF"><Download size={13} />PDF</a>
          <div className="hidden sm:block"><ModeSwitch /></div>
          <button className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 xl:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 animate-fadeIn overflow-y-auto border-l border-slate-800 bg-slate-950 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-white">Navigate</span>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Close menu"><X size={20} /></button>
            </div>
            <div className="mb-4"><ModeSwitch full /></div>
            <a href={PDF_URL} download className="mb-3 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm font-medium text-amber-200"><Download size={15} />Download PDF overview</a>
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
  const { tech } = useMode()
  const stats = [['9M', 'customers'], ['60K', 'sellers'], ['4', 'security teams, 24/7'], ['3', 'laws to follow'], ['16', 'company PDFs'], ['5–7', 'AI calls per incident']]
  const flow = [
    { icon: Calculator, t: 'The computer does the maths', d: 'Which laws apply, when each deadline falls, how many hours are left. Worked out by ordinary code and trained models, the same way every time.', c: 'cyan' },
    { icon: Brain, t: 'AI writes the explanation', d: 'AI helpers turn those facts into a clear briefing with a recommendation. They are not allowed to change any number.', c: 'violet' },
    { icon: UserCheck, t: 'A person makes the decision', d: 'The Data Protection Officer reads the briefing and decides. Nothing is sent to a regulator or a customer without them.', c: 'amber' },
  ]
  const ring = { cyan: 'text-cyan-400 bg-cyan-500/10 ring-cyan-500/30', violet: 'text-violet-400 bg-violet-500/10 ring-violet-500/30', amber: 'text-amber-400 bg-amber-500/10 ring-amber-500/30' }
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="chip border-cyan-500/30 bg-cyan-500/10 text-cyan-300"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-cyan-400" />Merrowfield Digital · Security team</span>
        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          BreachWatch <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="mt-4 max-w-3xl text-xl font-medium text-slate-200 sm:text-2xl">
          Helps the security team decide <span className="text-cyan-300">who must be told</span> about a security incident, and <span className="text-amber-300">by when</span>, without missing a legal deadline.
        </p>
        <p className="lead">
          {tech
            ? 'Autonomous incident triage with deterministic compliance and human-in-the-loop governance: ML models and pure-Python tools establish every fact, a LangGraph multi-agent workflow interprets them, and a checkpointed interrupt blocks any filing until the DPO decides.'
            : 'When something goes wrong (passwords stolen, data sent to the wrong person, a laptop lost), the law may require the company to tell certain authorities, and sometimes its customers, within a few hours. BreachWatch sorts the incidents by urgency, works out the deadlines, drafts a briefing, and then waits for a person to decide.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#story" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Start with the story <ArrowRight size={16} /></a>
          <a href="#walkthrough" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300">Follow one incident</a>
          <a href={PDF_URL} download className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"><Download size={16} />Download PDF overview</a>
        </div>
        <p className="mt-4 text-xs text-slate-500">Tip: use the <b className="text-slate-300">Plain / Technical</b> switch at the top to show or hide engineering detail.</p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(([v, l]) => (
            <div key={l} className="card card-hover p-4">
              <div className="text-2xl font-bold text-white">{v}</div>
              <div className="mt-1 text-xs text-slate-500">{l}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-lg font-semibold text-white">The big idea, in three steps</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {flow.map(({ icon: I, t, d, c }, i) => (
            <div key={t} className="card card-hover relative p-6">
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${ring[c]}`}><I size={20} /></span>
                <span className="font-mono text-xs text-slate-500">STEP {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">Why split it like this? See <Term k="boundary" />.</p>

        <div className="card mt-10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><Clock size={16} className="text-cyan-400" /> One moment in time, four local clocks</div>
            {tech && <span className="font-mono text-xs text-slate-500">SNAPSHOT_AT_UTC = {SNAPSHOT_AT_UTC}</span>}
          </div>
          <p className="mt-1 text-sm text-slate-400">The same moment looks different in each office. BreachWatch converts every time to one standard so deadlines can be compared fairly.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HUBS.map((h) => (
              <div key={h.code} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <span className="flex items-center gap-2 font-medium text-slate-100"><Globe2 size={15} className="text-teal-400" />{h.name}</span>
                <div className="mt-2 font-mono text-sm text-cyan-300">{fmt(h.tz)}</div>
                {tech && <div className="mt-0.5 text-xs text-slate-500">{h.tz} · INC-{h.code}-…</div>}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">All "hours left" figures are counted from this one moment. See <Term k="snapshot" />.</p>
        </div>
      </div>
    </section>
  )
}
