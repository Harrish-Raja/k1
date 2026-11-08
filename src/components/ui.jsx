import { useState } from 'react'
import { Check, Copy, ChevronDown, Info } from 'lucide-react'
import { GLOSSARY } from '../data'

export function Section({ id, kicker, title, lead, children, className = '' }) {
  return (
    <section id={id} className={`relative py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {kicker && <p className="kicker">{kicker}</p>}
        {title && <h2 className="h2">{title}</h2>}
        {lead && <p className="lead">{lead}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

/** Hover / focus tooltip for glossary terms. */
export function Term({ k, children }) {
  const entry = GLOSSARY[k]
  return (
    <span className="group relative inline-flex cursor-help items-baseline">
      <span tabIndex={0} className="border-b border-dashed border-cyan-500/60 text-slate-100 outline-none focus:text-cyan-300">
        {children || entry?.term}
      </span>
      <span role="tooltip" className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-xl border border-cyan-500/30 bg-slate-900 p-3 text-left text-xs font-normal leading-relaxed text-slate-300 opacity-0 shadow-xl shadow-black/50 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <span className="mb-1 flex items-center gap-1.5 font-semibold text-cyan-300"><Info size={12} />{entry?.term}</span>
        {entry?.def}
      </span>
    </span>
  )
}

export function CodeBlock({ code, lang = 'python', title }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* clipboard blocked */ }
  }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2">
        <span className="font-mono text-xs text-slate-500">{title || lang}</span>
        <button onClick={copy} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-cyan-300" aria-label="Copy code">
          {copied ? <><Check size={13} className="text-emerald-400" />Copied</> : <><Copy size={13} />Copy</>}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-slate-300"><code>{code}</code></pre>
    </div>
  )
}

export function Tabs({ tabs, active, onChange, size = 'md' }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 p-1" role="tablist">
      {tabs.map((t) => {
        const Icon = t.icon
        const on = t.id === active
        return (
          <button key={t.id} role="tab" aria-selected={on} onClick={() => onChange(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 font-medium transition ${size === 'sm' ? 'py-1.5 text-xs' : 'py-2 text-sm'} ${on ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            {Icon && <Icon size={16} />}{t.label}
          </button>
        )
      })}
    </div>
  )
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
      {items.map((it, i) => (
        <div key={it.q}>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-900">
            <span className="flex items-center gap-3 font-medium text-slate-100">
              {it.tag && <span className="chip border-amber-500/30 bg-amber-500/10 text-amber-300">{it.tag}</span>}
              {it.q}
            </span>
            <ChevronDown size={18} className={`shrink-0 text-slate-500 transition ${open === i ? 'rotate-180 text-cyan-400' : ''}`} />
          </button>
          {open === i && <div className="animate-fadeIn px-5 pb-5 text-sm leading-relaxed text-slate-400">{it.a}</div>}
        </div>
      ))}
    </div>
  )
}

export function Callout({ tone = 'cyan', icon: Icon, title, children }) {
  const tones = {
    cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-300',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
  }
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-sm font-semibold">{Icon && <Icon size={16} />}{title}</div>
      <div className="mt-1.5 text-sm leading-relaxed text-slate-400">{children}</div>
    </div>
  )
}

export const BAND = {
  HIGH: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  MEDIUM: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  LOW: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
}
