import { useState } from 'react'
import { Check, X, UserCog, ShieldCheck, MessageSquare, EyeOff, Equal, Lock } from 'lucide-react'
import { ROLES, AREAS } from '../data'
import { Section, Term, Callout } from './ui'

const ENDPOINTS = [
  { m: 'GET', p: '/queue', area: 'INTAKE' },
  { m: 'GET', p: '/queue/{incident_reference}', area: 'INTAKE' },
  { m: 'POST', p: '/assessments', area: 'ASSESSMENT' },
  { m: 'GET', p: '/incidents?status_value=…', area: 'AUDIT' },
  { m: 'POST', p: '/incidents/{assessment_id}/decision', area: 'DECISION' },
  { m: 'GET', p: '/incidents/{assessment_id}/calls', area: 'AUDIT' },
  { m: 'GET', p: '/audit/chat-turns', area: 'AUDIT' },
  { m: 'POST', p: '/chat/ask', area: 'CHAT' },
]

const REFUSAL = 'I can’t share anything about a named incident.'

export default function Rbac() {
  const [role, setRole] = useState('analyst')
  const [ep, setEp] = useState(4)
  const [askRole, setAskRole] = useState('comms')
  const [inc, setInc] = useState('undisclosed')
  const r = ROLES.find((x) => x.id === role)
  const e = ENDPOINTS[ep]
  const allowed = r.areas.includes(e.area)

  const incidents = {
    undisclosed: { ref: 'INC-BLR-0041874', label: 'Exists · assessed · NOTIFIED (regulator only)' },
    missing: { ref: 'INC-WAW-9999999', label: 'Does not exist' },
    disclosed: { ref: 'INC-BLR-0041927', label: 'Exists · NOTIFIED_AND_DISCLOSED' },
  }
  const privileged = askRole !== 'comms'
  let answer, refused = false, source = '—'
  if (!privileged) {
    if (inc === 'disclosed') { answer = 'Merrowfield told the customers affected by INC-BLR-0041927 in a notice sent at 2026-03-14T01:40:00Z. This is the notice as it was published: …'; source = 'Customer notice for INC-BLR-0041927' }
    else { answer = REFUSAL; refused = true }
  } else {
    if (inc === 'missing') answer = 'CHAT_UNKNOWN_INCIDENT_MESSAGE: that reference is not in the live queue.'
    else answer = `Assessment ASM-… · status ${inc === 'disclosed' ? 'NOTIFIED_AND_DISCLOSED' : 'NOTIFIED'} · harm 0.82 HIGH · procedures, earliest deadline, effort, decision and who took it…`
    source = 'Record (security_incidents)'
  }

  return (
    <Section id="rbac" kicker="Access control" title="Role-based access & the disclosure line"
      lead="Everyone signs in. The service enforces every boundary itself with 401 and 403. It never relies on the dashboard hiding a page.">
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium">Role</th>
              {AREAS.map((a) => <th key={a} className="px-3 py-3 text-center font-medium">AREA_{a}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {ROLES.map((ro) => (
              <tr key={ro.id} className={`transition ${role === ro.id ? 'bg-cyan-500/5' : 'hover:bg-slate-900'}`} onClick={() => setRole(ro.id)}>
                <td className="cursor-pointer px-5 py-4">
                  <div className="font-medium text-slate-100">{ro.name}</div>
                  <div className="text-xs text-slate-500">{ro.note}</div>
                </td>
                {AREAS.map((a) => (
                  <td key={a} className="px-3 py-4 text-center">
                    {ro.areas.includes(a)
                      ? <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-emerald-400"><Check size={15} /></span>
                      : <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-rose-500/10 text-rose-400/80"><X size={15} /></span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="flex items-center gap-2 font-semibold text-white"><ShieldCheck size={18} className="text-cyan-400" />Guard simulator</h3>
          <p className="mt-1 text-sm text-slate-400"><span className="code">authorize_request</span> → <span className="code">check_request_permission(role, path, method)</span></p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-500">Signed in as
              <select value={role} onChange={(x) => setRole(x.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                {ROLES.map((ro) => <option key={ro.id} value={ro.id}>{ro.name}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-500">Request
              <select value={ep} onChange={(x) => setEp(+x.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200">
                {ENDPOINTS.map((x, i) => <option key={x.p + x.m} value={i}>{x.m} {x.p}</option>)}
              </select>
            </label>
          </div>
          <div key={role + ep} className={`mt-5 animate-fadeIn rounded-xl border p-4 font-mono text-xs ${allowed ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/40 bg-rose-500/5'}`}>
            <div className="text-slate-500">{e.m} {e.p}</div>
            <div className="mt-1 text-slate-400">area = <span className="text-cyan-300">AREA_{e.area}</span>{e.area === 'DECISION' && ' (POST ending in DECISION_PATH_ENDING)'}</div>
            <div className={`mt-3 text-base font-bold ${allowed ? 'text-emerald-300' : 'text-rose-300'}`}>{allowed ? '200 OK' : '403 Forbidden'}</div>
            {!allowed && <div className="mt-1 text-slate-400">AREA_REFUSED_MESSAGE: {r.name} does not reach {e.area}</div>}
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pages offered (ROLE_PAGE_ACCESS)</div>
            <div className="mt-2 flex flex-wrap gap-1.5">{r.pages.map((p) => <span key={p} className="chip border-cyan-500/30 bg-cyan-500/10 text-cyan-300">{p}</span>)}</div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Without a token, or with a token no account holds, the request gets 401 SIGN_IN_REQUIRED_MESSAGE. A wrong username and a wrong password get the same 401 SIGN_IN_FAILED_MESSAGE.</p>
        </div>

        <div className="card p-6">
          <h3 className="flex items-center gap-2 font-semibold text-white"><EyeOff size={18} className="text-amber-400" />The <Term k="enumeration">anti-enumeration</Term> defence</h3>
          <p className="mt-1 text-sm text-slate-400">Ask the chat "What is the status of <span className="font-mono">{incidents[inc].ref}</span>?"</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-500">Asker
              <select value={askRole} onChange={(x) => setAskRole(x.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                {ROLES.map((ro) => <option key={ro.id} value={ro.id}>{ro.name}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-500">The incident
              <select value={inc} onChange={(x) => setInc(x.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                {Object.entries(incidents).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </label>
          </div>
          <div key={askRole + inc} className="mt-5 animate-fadeIn space-y-3">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-slate-800 px-4 py-2.5 text-sm text-slate-200">What is the status of {incidents[inc].ref}?</div>
            <div className={`max-w-[92%] rounded-2xl rounded-bl-sm border px-4 py-3 text-sm ${refused ? 'border-rose-500/30 bg-rose-500/5 text-rose-100' : 'border-slate-700 bg-slate-900 text-slate-200'}`}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="chip border-orange-500/30 bg-orange-500/10 text-[10px] text-orange-300">INCIDENT STATUS</span>
                {refused && <span className="chip border-rose-500/30 text-[10px] text-rose-300"><Lock size={10} />Refused</span>}
              </div>
              {answer}
              <div className="mt-2 text-[11px] text-slate-500">Source: {source}</div>
            </div>
          </div>
          {!privileged && inc !== 'disclosed' && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200">
              <Equal size={15} className="shrink-0" />Same words whether the incident exists or not (CHAT_INCIDENT_REFUSAL_MESSAGE). Try switching between the first two incidents.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Callout tone="cyan" icon={UserCog} title="Assess ≠ decide">The Incident Response Plan says the analyst who investigates may not decide notification. That rule is why the workflow stops at a gate.</Callout>
        <Callout tone="amber" icon={MessageSquare} title="One question, one call">The chat answers only from the documents it may read, with a distance guard. If the documents don't cover the question, it refuses with CHAT_REFUSAL_MESSAGE and cites nothing.</Callout>
        <Callout tone="emerald" icon={ShieldCheck} title="Status comes from the record">Incident status answers come from the database and config, never from a model. Comms staff see only the published notice.</Callout>
      </div>
    </Section>
  )
}
