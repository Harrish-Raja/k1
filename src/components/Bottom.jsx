import { useMemo, useState } from 'react'
import { Folder, FolderOpen, FileCode2, Search, Database, Sparkles, Brain, Library, Server, LayoutDashboard, Terminal, Shield, ChevronRight } from 'lucide-react'
import { TREE, ENTRY_POINTS, DECISIONS_DEEP } from '../data'
import { Section, CodeBlock, Accordion } from './ui'

const DOT = { cyan: 'bg-cyan-400', emerald: 'bg-emerald-400', violet: 'bg-violet-400', amber: 'bg-amber-400', rose: 'bg-rose-400', sky: 'bg-sky-400', teal: 'bg-teal-400', fuchsia: 'bg-fuchsia-400', orange: 'bg-orange-400', lime: 'bg-lime-400' }

export function Explorer() {
  const [q, setQ] = useState('')
  const [openDirs, setOpenDirs] = useState({ tools: true })
  const [sel, setSel] = useState({ dir: 'tools', f: 'deadline_tools.py' })
  const ql = q.trim().toLowerCase()
  const filtered = useMemo(() => TREE.map((d) => ({
    ...d,
    files: d.files.filter((f) => !ql || d.dir.includes(ql) || f.f.toLowerCase().includes(ql) || f.fns.some((fn) => fn.toLowerCase().includes(ql)) || f.d.toLowerCase().includes(ql)),
  })).filter((d) => d.files.length), [ql])
  const dir = TREE.find((d) => d.dir === sel.dir)
  const file = dir.files.find((f) => f.f === sel.f)

  return (
    <Section id="explorer" kicker="Codebase" title="Interactive project explorer" lead="Every module has a single responsibility. Search by file, function or concept: try 'snapshot', 'campaign' or 'checkpoint'.">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="card p-3">
          <label className="relative block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search modules & functions…" className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none" />
          </label>
          <div className="mt-3 max-h-[560px] overflow-y-auto font-mono text-[13px]">
            <div className="px-2 py-1 text-slate-500">Project/</div>
            {filtered.map((d) => {
              const open = ql ? true : openDirs[d.dir]
              return (
                <div key={d.dir}>
                  <button onClick={() => setOpenDirs({ ...openDirs, [d.dir]: !openDirs[d.dir] })} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-slate-200 hover:bg-slate-800">
                    <ChevronRight size={13} className={`text-slate-500 transition ${open ? 'rotate-90' : ''}`} />
                    {open ? <FolderOpen size={15} className="text-amber-300" /> : <Folder size={15} className="text-amber-300" />}
                    {d.dir}/<span className={`ml-auto h-1.5 w-1.5 rounded-full ${DOT[d.color]}`} />
                  </button>
                  {open && d.files.map((f) => {
                    const on = sel.dir === d.dir && sel.f === f.f
                    return (
                      <button key={f.f} onClick={() => setSel({ dir: d.dir, f: f.f })} className={`flex w-full items-center gap-2 rounded-md py-1.5 pl-10 pr-2 text-left transition ${on ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}`}>
                        <FileCode2 size={14} className="shrink-0" /><span className="truncate">{f.f}</span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
            {filtered.length === 0 && <p className="px-2 py-4 text-slate-500">Nothing matches "{q}".</p>}
          </div>
        </div>
        <div key={sel.dir + sel.f} className="animate-fadeIn space-y-4">
          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-slate-500">
              <span className={`h-2 w-2 rounded-full ${DOT[dir.color]}`} />{dir.dir}/<span className="text-white">{file.f}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{dir.blurb}</p>
            <p className="mt-4 text-base leading-relaxed text-slate-200">{file.d}</p>
            <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Public interface ({file.fns.length})</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {file.fns.map((fn) => (
                <span key={fn} className={`rounded-lg border px-2.5 py-1 font-mono text-xs ${ql && fn.toLowerCase().includes(ql) ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200' : 'border-slate-700 bg-slate-950 text-slate-300'}`}>{/^[A-Z]/.test(fn) || fn.includes('_engine') || fn === 'SessionFactory' ? fn : `${fn}()`}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TREE.map((d) => (
              <button key={d.dir} onClick={() => { setSel({ dir: d.dir, f: d.files[0].f }); setOpenDirs({ ...openDirs, [d.dir]: true }) }}
                className={`card card-hover p-4 text-left ${sel.dir === d.dir ? 'border-cyan-500/40' : ''}`}>
                <div className="flex items-center gap-2 font-mono text-sm text-slate-100"><span className={`h-2 w-2 rounded-full ${DOT[d.color]}`} />{d.dir}/</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{d.blurb}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

const EP_ICON = { Database, Sparkles, Brain, Library, Server, LayoutDashboard }

export function Pipeline() {
  const [i, setI] = useState(0)
  const ep = ENTRY_POINTS[i]
  const Icon = EP_ICON[ep.icon]
  return (
    <Section id="pipeline" kicker="Execution" title="Six entry points, run in order" lead="The first four build a stage of the system and are safe to run again. The last two start the service and the dashboard. Every command is run from the Project folder.">
      <div className="relative">
        <div className="absolute left-0 right-0 top-6 hidden h-px bg-slate-800 md:block" />
        <div className="relative grid grid-cols-3 gap-3 md:grid-cols-6">
          {ENTRY_POINTS.map((e, k) => {
            const I = EP_ICON[e.icon]
            const on = k === i
            return (
              <button key={e.n} onClick={() => setI(k)} className="group flex flex-col items-center text-center">
                <span className={`grid h-12 w-12 place-items-center rounded-full border-2 bg-slate-950 transition ${on ? 'border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30' : k < i ? 'border-teal-600 text-teal-400' : 'border-slate-700 text-slate-500 group-hover:border-slate-500'}`}><I size={20} /></span>
                <span className={`mt-2 text-xs font-medium ${on ? 'text-white' : 'text-slate-500'}`}>{e.n}. {e.title}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div key={i} className="mt-8 grid animate-fadeIn gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30"><Icon size={20} /></span>
            <div>
              <div className="font-mono text-sm text-cyan-300">{ep.file}</div>
              <h3 className="text-lg font-semibold text-white">{ep.title}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{ep.does}</p>
          <div className="mt-5"><CodeBlock lang="bash" title="terminal" code={`cd Project\n${ep.cmd || `python3 ${ep.file}`}`} /></div>
          <div className="mt-4 flex justify-between">
            <button disabled={i === 0} onClick={() => setI(i - 1)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 disabled:opacity-30">← Previous</button>
            <button disabled={i === ENTRY_POINTS.length - 1} onClick={() => setI(i + 1)} className="rounded-lg bg-cyan-500/15 px-3 py-1.5 text-sm text-cyan-300 ring-1 ring-cyan-500/40 disabled:opacity-30">Next →</button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black/60">
          <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-slate-500"><Terminal size={12} />expected output</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-emerald-300/90">{ep.out}</pre>
        </div>
      </div>
    </Section>
  )
}

export function Decisions() {
  return (
    <Section id="decisions" kicker="Engineering decisions" title="Why it's built this way" lead="Short deep dives into the choices that make the system auditable. Open any one.">
      <Accordion items={DECISIONS_DEEP} />
    </Section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-slate-800 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <span className="flex items-center gap-2"><Shield size={16} className="text-cyan-400" />BreachWatch AI · Architecture showcase for Merrowfield Digital (fictional)</span>
        <span className="font-mono text-xs">FastAPI · LangGraph · ChromaDB · scikit-learn · SQLAlchemy · Streamlit</span>
      </div>
    </footer>
  )
}
