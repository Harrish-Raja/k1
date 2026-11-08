import { useEffect, useRef, useState } from 'react'
import { Cpu, Bot, PauseCircle, Database, Play, RotateCcw, HardDrive, ChevronDown, Zap } from 'lucide-react'
import { NODES, DECISIONS } from '../data'
import { Section, Term } from './ui'

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))
const PRE = ['load_incident_context', 'plan_assessment', 'assess_harm', 'identify_attack', 'check_reporting_duties', 'compose_incident_assessment', 'request_dpo_decision']

function NodeBtn({ id, state, onClick, selected, dim }) {
  const n = byId[id]
  const Icon = n.kind === 'agent' ? Bot : n.kind === 'gate' ? PauseCircle : n.id === 'record_incident_outcome' ? Database : Cpu
  const base = n.kind === 'gate' ? 'border-amber-500/50 bg-amber-500/10' : n.kind === 'agent' ? 'border-violet-500/30 bg-violet-500/5' : 'border-teal-500/30 bg-teal-500/5'
  const iconC = n.kind === 'gate' ? 'text-amber-300' : n.kind === 'agent' ? 'text-violet-300' : 'text-teal-300'
  return (
    <button onClick={() => onClick(id)}
      className={`relative flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition ${base}
        ${selected ? 'ring-2 ring-cyan-400/70' : ''} ${state === 'active' ? 'scale-[1.02] shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400' : ''}
        ${state === 'done' ? 'opacity-100' : ''} ${dim ? 'opacity-30' : 'hover:border-cyan-500/50'}`}>
      <Icon size={18} className={`shrink-0 ${iconC}`} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-slate-100">{n.label}</span>
        <span className="block truncate font-mono text-[10px] text-slate-500">{n.id}</span>
      </span>
      {n.calls > 0 && <span className="chip shrink-0 border-violet-500/30 text-[10px] text-violet-300">1 call</span>}
      {state === 'done' && <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-950" />}
      {state === 'active' && <span className="absolute -right-1.5 -top-1.5 h-3 w-3 animate-pulseDot rounded-full bg-cyan-400 ring-2 ring-slate-950" />}
    </button>
  )
}

const Line = ({ on }) => <div className="mx-auto flex h-5 w-px justify-center"><div className={`w-px ${on ? 'bg-cyan-400' : 'bg-slate-700'}`} /></div>

export default function WorkflowFlow() {
  const [decision, setDecision] = useState('NOTIFY_BOTH')
  const [selected, setSelected] = useState('check_reporting_duties')
  const [step, setStep] = useState(-1) // index into sequence, -1 = idle
  const [running, setRunning] = useState(false)
  const timer = useRef(null)
  const dec = DECISIONS.find((d) => d.id === decision)
  const seq = [...PRE, ...dec.path, 'record_incident_outcome']
  const gateIdx = PRE.length - 1
  const atGate = step === gateIdx && !running
  const visited = new Set(seq.slice(0, step + 1))
  const calls = seq.slice(0, step + 1).reduce((a, id) => a + byId[id].calls, 0)
  const done = step >= seq.length - 1

  useEffect(() => {
    if (!running) return
    timer.current = setTimeout(() => {
      const next = step + 1
      setStep(next)
      setSelected(seq[next])
      if (next === gateIdx || next >= seq.length - 1) setRunning(false)
    }, 750)
    return () => clearTimeout(timer.current)
  }, [running, step]) // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => { setStep(0); setSelected(seq[0]); setRunning(true) }
  const resume = () => setRunning(true)
  const reset = () => { clearTimeout(timer.current); setRunning(false); setStep(-1) }
  const stateOf = (id) => (seq[step] === id ? 'active' : visited.has(id) ? 'done' : 'idle')
  const lanes = [
    { d: DECISIONS[0], nodes: [] },
    { d: DECISIONS[1], nodes: ['draft_regulator_filing'] },
    { d: DECISIONS[2], nodes: ['draft_customer_notice', 'draft_regulator_filing'] },
  ]
  const sel = byId[selected]
  const laneTone = { emerald: 'border-emerald-500/40 text-emerald-300', amber: 'border-amber-500/40 text-amber-300', rose: 'border-rose-500/40 text-rose-300' }

  return (
    <Section id="workflow" kicker="Pillar 4 in depth" title="The LangGraph workflow & the DPO gate"
      lead="Ten nodes, five pre-gate agents and one interrupt. Pick a disposition and run the simulation: it pauses at the gate exactly as the real graph does, with the pause saved to disk.">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {!running && step === -1 && <button onClick={start} className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"><Play size={15} />Simulate run</button>}
              {atGate && <button onClick={resume} className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"><Zap size={15} />DPO decides: {dec.label}</button>}
              {step !== -1 && <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500"><RotateCcw size={14} />Reset</button>}
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5">
              <span className="text-xs text-slate-500">LLM calls</span>
              <span className="font-mono text-lg font-bold text-white">{step === -1 ? 0 : calls}</span>
              <span className="font-mono text-xs text-slate-500">/ {dec.calls}</span>
            </div>
          </div>

          {atGate && (
            <div className="mt-4 flex animate-fadeIn items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
              <HardDrive size={18} className="mt-0.5 shrink-0 text-amber-300" />
              <span>Interrupted. Run status is <b>AWAITING_DECISION</b> and state is checkpointed to <span className="code">checkpoint.db</span>. Nothing has been filed and no customer has been told. The machine could be switched off now.</span>
            </div>
          )}
          {done && step !== -1 && (
            <div className="mt-4 animate-fadeIn rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              Run COMPLETE. Incident status: <b className="font-mono">{dec.status}</b>, using {dec.calls} language model calls.
            </div>
          )}

          <div className="mx-auto mt-6 max-w-md">
            {PRE.map((id, i) => (
              <div key={id}>
                <NodeBtn id={id} state={stateOf(id)} selected={selected === id} onClick={setSelected} />
                {i < PRE.length - 1 && <Line on={visited.has(PRE[i + 1])} />}
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-center"><ChevronDown className="text-slate-600" /></div>
          <p className="mb-3 text-center text-xs text-slate-500">Branches on the decision and nothing else</p>
          <div className="grid gap-3 md:grid-cols-3">
            {lanes.map(({ d, nodes }) => {
              const on = d.id === decision
              return (
                <div key={d.id} onClick={() => step <= gateIdx && setDecision(d.id)}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-3 transition ${on ? laneTone[d.tone] + ' bg-slate-950/40' : 'border-slate-800 text-slate-500 opacity-60 hover:opacity-90'}`}>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold leading-tight">{d.label}</span>
                    <span className="chip shrink-0 border-current text-[10px]">+{d.calls - 5}</span>
                  </div>
                  <div className="space-y-2">
                    {nodes.length === 0 && <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-4 text-center text-xs text-slate-500">no further call</div>}
                    {nodes.map((id) => <NodeBtn key={id} id={id} state={on ? stateOf(id) : 'idle'} selected={selected === id && on} dim={!on} onClick={setSelected} />)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex justify-center"><ChevronDown className="text-slate-600" /></div>
          <div className="mx-auto mt-1 max-w-md"><NodeBtn id="record_incident_outcome" state={stateOf('record_incident_outcome')} selected={selected === 'record_incident_outcome'} onClick={setSelected} /></div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><Cpu size={12} className="text-teal-300" />tool node · no LLM</span>
            <span className="flex items-center gap-1.5"><Bot size={12} className="text-violet-300" />agent · exactly one LLM call</span>
            <span className="flex items-center gap-1.5"><PauseCircle size={12} className="text-amber-300" />interrupt / human gate</span>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div key={selected} className="card animate-fadeIn p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{sel.kind === 'agent' ? 'Agent node' : sel.kind === 'gate' ? 'Human gate' : 'Tool node'}</div>
            <h3 className="mt-1 text-xl font-semibold text-white">{sel.label}</h3>
            <div className="mt-1 font-mono text-xs text-cyan-300">{sel.id}_node(state)</div>
            {sel.agent && <div className="mt-1 font-mono text-xs text-violet-300">agent_name = "{sel.agent}"</div>}
            <p className="mt-4 text-sm leading-relaxed text-slate-300">{sel.desc}</p>
            <dl className="mt-5 space-y-3 text-xs">
              <div><dt className="font-semibold uppercase tracking-wider text-slate-500">Reads</dt><dd className="mt-1 font-mono text-slate-300">{sel.reads}</dd></div>
              <div><dt className="font-semibold uppercase tracking-wider text-slate-500">Writes</dt><dd className="mt-1 font-mono text-slate-300">{sel.writes}{sel.calls > 0 && ', llm_call_log'}</dd></div>
              {sel.fields && <div><dt className="font-semibold uppercase tracking-wider text-slate-500">Labelled reply fields</dt><dd className="mt-1 font-mono text-violet-300">{sel.fields}</dd></div>}
              <div><dt className="font-semibold uppercase tracking-wider text-slate-500">LLM calls</dt><dd className="mt-1 font-mono text-white">{sel.calls}</dd></div>
            </dl>
          </div>
          <div className="card mt-4 p-5 text-sm text-slate-400">
            <div className="mb-2 font-semibold text-white">State rules</div>
            <ul className="space-y-1.5">
              <li>• <span className="code">llm_call_log</span> accumulates; every other key is replaced.</li>
              <li>• No key exists that nothing reads.</li>
              <li>• Each call is written to <span className="code">llm_calls</span> as it returns.</li>
              <li>• Each run's own <span className="code">thread_id</span> keeps <Term k="gate">pauses</Term> apart.</li>
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  )
}
