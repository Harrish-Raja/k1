import { useState } from 'react'
import { Stethoscope, ChevronLeft, ChevronRight, User, Cpu, Bot, UserCheck } from 'lucide-react'
import { STORY, WALKTHROUGH } from '../data'
import { Section, Callout } from './ui'
import { Tech } from '../mode'

export function Story() {
  return (
    <Section id="story" kicker="Start here" title="The story in 60 seconds" lead="No technical knowledge needed. This is the problem BreachWatch was built to solve.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STORY.map((s) => (
          <div key={s.n} className="card card-hover p-6">
            <span className="font-mono text-sm font-bold text-cyan-400">{s.n}</span>
            <h3 className="mt-2 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Callout tone="cyan" icon={Stethoscope} title="Think of a hospital emergency room">
          A triage nurse doesn't treat patients in the order they arrive. They check who is most urgent and send them to the right doctor. BreachWatch does the same for security incidents: it puts the most urgent ones at the top, works out which authorities must be told and by when, and prepares the paperwork. The senior doctor (here, the Data Protection Officer) still makes the call.
        </Callout>
        <Callout tone="amber" icon={UserCheck} title="What BreachWatch does, in one sentence">
          It <b className="text-slate-200">ranks</b> the open incidents by how close each is to a legal deadline, <b className="text-slate-200">works out</b> every authority that must be told and by when, <b className="text-slate-200">drafts</b> a recommendation, and then <b className="text-slate-200">stops</b>. Nothing is sent and no customer is told on the word of an AI.
        </Callout>
      </div>
    </Section>
  )
}

const WHO_ICON = (who) => (who.includes('Analyst') ? User : who.includes('Protection') ? UserCheck : who.includes('AI') ? Bot : Cpu)

export function Walkthrough() {
  const [i, setI] = useState(0)
  const s = WALKTHROUGH[i]
  const Icon = WHO_ICON(s.who)
  return (
    <Section id="walkthrough" kicker="Example" title="Follow one incident from start to finish"
      lead='A made-up example: a fake login page tricks some sellers into giving away their passwords. Click through the steps.'>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <ol className="card space-y-1 p-3">
          {WALKTHROUGH.map((w, k) => (
            <li key={w.t}>
              <button onClick={() => setI(k)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${k === i ? 'bg-cyan-500/10 text-cyan-200 ring-1 ring-cyan-500/40' : k < i ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${k === i ? 'bg-cyan-400 text-slate-950' : k < i ? 'bg-teal-600/40 text-teal-200' : 'bg-slate-800 text-slate-500'}`}>{k + 1}</span>
                {w.t}
              </button>
            </li>
          ))}
        </ol>
        <div key={i} className="card flex animate-fadeIn flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">Step {i + 1} of {WALKTHROUGH.length}</span>
            <span className="chip border-slate-700 text-slate-300"><Icon size={13} />{s.who}</span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-white">{s.t}</h3>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{s.text}</p>
          <Tech><div className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 font-mono text-xs text-amber-200/90">{s.tech}</div></Tech>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-cyan-400 transition-all" style={{ width: `${((i + 1) / WALKTHROUGH.length) * 100}%` }} /></div>
          <div className="mt-auto flex justify-between pt-6">
            <button disabled={i === 0} onClick={() => setI(i - 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 disabled:opacity-30"><ChevronLeft size={16} />Back</button>
            <button disabled={i === WALKTHROUGH.length - 1} onClick={() => setI(i + 1)} className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-30">Next step<ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">Numbers in this example are made up for illustration. In the real system, deadlines are read from the company's rulebook PDFs.</p>
    </Section>
  )
}
