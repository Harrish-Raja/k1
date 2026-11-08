import { Nav, Hero } from './components/Top'
import Problem from './components/Problem'
import Architecture from './components/Architecture'
import WorkflowFlow from './components/WorkflowFlow'
import Rbac from './components/Rbac'
import { Explorer, Pipeline, Decisions, Footer } from './components/Bottom'

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <div className="border-t border-slate-900"><Problem /></div>
        <div className="border-t border-slate-900 bg-slate-900/20"><Architecture /></div>
        <div className="border-t border-slate-900"><WorkflowFlow /></div>
        <div className="border-t border-slate-900 bg-slate-900/20"><Rbac /></div>
        <div className="border-t border-slate-900"><Explorer /></div>
        <div className="border-t border-slate-900 bg-slate-900/20"><Pipeline /></div>
        <div className="border-t border-slate-900"><Decisions /></div>
      </main>
      <Footer />
    </div>
  )
}
