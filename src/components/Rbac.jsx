import { useState } from 'react'
import { Check, X, UserCog, ShieldCheck, MessageSquare, EyeOff, Equal, Lock } from 'lucide-react'
import { ROLES, AREAS } from '../data'
import { Section, Term, Callout } from './ui'
import { Tech, useMode } from '../mode'

const ACTIONS = [
  { plain: 'Open the incident list', m: 'GET', p: '/queue', area: 'INTAKE' },
  { plain: 'Open one incident’s details', m: 'GET', p: '/queue/{incident_reference}', area: 'INTAKE' },
  { plain: 'Start an AI assessment', m: 'POST', p: '/assessments', area: 'ASSESSMENT' },
  { plain: 'Make the final decision', m: 'POST', p: '/incidents/{assessment_id}/decision', area: 'DECISION' },
  { plain: 'View past decisions and AI usage', m: 'GET', p: '/incidents/{assessment_id}/calls', area: 'AUDIT' },
  { plain: 'See everyone’s chat questions', m: 'GET', p: '/audit/chat-turns', area: 'AUDIT' },
  { plain: 'Ask the chat assistant', m: 'POST', p: '/chat/ask', area: 'CHAT' },
]
const areaName = (id) => AREAS.find((a) => a.id === id).plain

export default function Rbac() {
  const { tech } = useMode()
  const [role, setRole] = useState('analyst')
  const [act, setAct] = useState(3)
  const [askRole, setAskRole] = useState('comms')
  const [inc, setInc] = useState('undisclosed')
  const r = ROLES.find((x) => x.id === role)
  const a = ACTIONS[act]
  const allowed = r.areas.includes(a.area)

  const incidents = {
    undisclosed: { ref: 'INC-BLR-0041874', label: 'A real incident, customers NOT told yet' },
    missing: { ref: 'INC-WAW-9999999', label: 'An incident that doesn’t exist' },
    disclosed: { ref: 'INC-BLR-0041927', label: 'A real incident, customers already told' },
  }
  const privileged = askRole !== 'comms'
  let answer, refused = false, source = ''
  if (!privileged) {
    if (inc === 'disclosed') { answer = 'Merrowfield told the affected customers in a notice. Here is the notice exactly as it was published: …'; source = 'The published customer notice' }
    else { answer = 'Sorry, I can’t share anything about a specific incident.'; refused = true }
  } else {
    answer = inc === 'missing' ? 'That incident reference isn’t in the current list.' : 'Status, risk level, which laws apply, the earliest deadline and hours left, the recommendation, and the DPO’s decision with their reason.'
    source = 'The internal record'
  }

  return (
    <Section id="rbac" kicker="Permissions" title="Who can do what"
      lead="There are three kinds of user. Everyone signs in, and each person can only open the pages their job needs. The back-end checks this on every request too, so hiding a button is not the only protection.">
      <div className="grid gap-4 md:grid-cols-3">
        {ROLES.map((ro) => (
          <div key={ro.id} className="card card-hover p-5">
            <div className="flex items-center gap-2"><UserCog size={18} className="text-cyan-400" /><h3 className="font-semibold text-white">{ro.name}</h3></div>
            <p className="mt-2 text-sm text-slate-400">{ro.note}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{ro.pages.map((p) => <span key={p} className="chip border-cyan-500/30 bg-cyan-500/10 text-cyan-300">{p}</span>)}</div>
          </div>
        ))}
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-xs text-slate-400">
              <th className="px-5 py-3 font-medium">Role</th>
              {AREAS.map((ar) => <th key={ar.id} className="px-3 py-3 text-center font-medium">{ar.plain}{tech && <div className="font-mono text-[10px] text-slate-600">AREA_{ar.id}</div>}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {ROLES.map((ro) => (
              <tr key={ro.id} className="hover:bg-slate-900">
                <td className="px-5 py-4 font-medium text-slate-100">{ro.name}</td>
                {AREAS.map((ar) => (
                  <td key={ar.id} className="px-3 py-4 text-center">
                    {ro.areas.includes(ar.id)
                      ? <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-emerald-400" aria-label="allowed"><Check size={15} /></span>
                      : <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-rose-500/10 text-rose-400/80" aria-label="not allowed"><X size={15} /></span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="flex items-center gap-2 font-semibold text-white"><ShieldCheck size={18} className="text-cyan-400" />Try it: is this allowed?</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-500">I am a…
              <select value={role} onChange={(x) => setRole(x.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                {ROLES.map((ro) => <option key={ro.id} value={ro.id}>{ro.name}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-500">…and I want to
              <select value={act} onChange={(x) => setAct(+x.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                {ACTIONS.map((x, i) => <option key={x.p + x.m} value={i}>{x.plain}</option>)}
              </select>
            </label>
          </div>
          <div key={role + act} className={`mt-5 animate-fadeIn rounded-xl border p-4 ${allowed ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/40 bg-rose-500/5'}`}>
            <div className={`flex items-center gap-2 text-lg font-bold ${allowed ? 'text-emerald-300' : 'text-rose-300'}`}>{allowed ? <><Check size={20} />Allowed</> : <><X size={20} />Not allowed</>}</div>
            <p className="mt-1 text-sm text-slate-300">{allowed ? `A ${r.name} can ${areaName(a.area).toLowerCase()}.` : `A ${r.name} can't ${areaName(a.area).toLowerCase()}. The back-end refuses the request even if someone bypasses the screen.`}</p>
            <Tech><div className="mt-3 font-mono text-xs text-slate-500">{a.m} {a.p} → AREA_{a.area} → {allowed ? '200 OK' : '403 Forbidden (AREA_REFUSED_MESSAGE)'}</div></Tech>
          </div>
          <p className="mt-4 text-xs text-slate-500">Not signed in? Every request is refused. A wrong username and a wrong password show the same error, so nobody can find out which usernames exist.</p>
        </div>

        <div className="card p-6">
          <h3 className="flex items-center gap-2 font-semibold text-white"><EyeOff size={18} className="text-amber-400" />The chat can't be used to snoop</h3>
          <p className="mt-1 text-sm text-slate-400">A communications agent writes to customers, so they must not learn about an incident before customers are told. Try asking the chat about different incidents:</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-500">Who is asking
              <select value={askRole} onChange={(x) => setAskRole(x.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                {ROLES.map((ro) => <option key={ro.id} value={ro.id}>{ro.name}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-500">About which incident
              <select value={inc} onChange={(x) => setInc(x.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                {Object.entries(incidents).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </label>
          </div>
          <div key={askRole + inc} className="mt-5 animate-fadeIn space-y-3">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-slate-800 px-4 py-2.5 text-sm text-slate-200">What's the status of {incidents[inc].ref}?</div>
            <div className={`max-w-[92%] rounded-2xl rounded-bl-sm border px-4 py-3 text-sm ${refused ? 'border-rose-500/30 bg-rose-500/5 text-rose-100' : 'border-slate-700 bg-slate-900 text-slate-200'}`}>
              {refused && <span className="chip mb-1.5 border-rose-500/30 text-[10px] text-rose-300"><Lock size={10} />Refused</span>}
              <div>{answer}</div>
              {source && <div className="mt-2 text-[11px] text-slate-500">Answered from: {source}</div>}
            </div>
          </div>
          {!privileged && inc !== 'disclosed' && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200">
              <Equal size={15} className="shrink-0" /><span>The exact same refusal comes back whether the incident exists or not. Switch between the first two options to see. Otherwise, asking about made-up numbers would reveal which ones are real. See <Term k="enumeration" />.</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Callout tone="cyan" icon={UserCog} title="Investigating ≠ deciding">Company policy says the person who investigates must not also decide whether to notify. That's why the system stops for the DPO.</Callout>
        <Callout tone="amber" icon={MessageSquare} title="The chat only uses company documents">If the answer isn't in the documents, it says so politely instead of guessing.</Callout>
        <Callout tone="emerald" icon={ShieldCheck} title="Incident answers come from records">Questions about a specific incident are answered from the saved records, never invented by AI.</Callout>
      </div>
    </Section>
  )
}
