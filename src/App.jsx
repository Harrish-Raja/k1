import { ModeProvider } from './mode'
import { Nav, Hero } from './components/Top'
import { Story, Walkthrough } from './components/Story'
import Problem from './components/Problem'
import Architecture from './components/Architecture'
import WorkflowFlow from './components/WorkflowFlow'
import Rbac from './components/Rbac'
import { Explorer, Pipeline, Faq, Glossary, Footer } from './components/Bottom'

export default function App() {
  return (
    <ModeProvider>
      <div className="min-h-screen overflow-x-hidden">
        <Nav />
        <main>
          <Hero />
          <div className="border-t border-slate-900"><Story /></div>
          <div className="border-t border-slate-900 bg-slate-900/20"><Walkthrough /></div>
          <div className="border-t border-slate-900"><Problem /></div>
          <div className="border-t border-slate-900 bg-slate-900/20"><Architecture /></div>
          <div className="border-t border-slate-900"><WorkflowFlow /></div>
          <div className="border-t border-slate-900 bg-slate-900/20"><Rbac /></div>
          <div className="border-t border-slate-900"><Explorer /></div>
          <div className="border-t border-slate-900 bg-slate-900/20"><Pipeline /></div>
          <div className="border-t border-slate-900"><Faq /></div>
          <div className="border-t border-slate-900 bg-slate-900/20"><Glossary /></div>
        </main>
        <Footer />
      </div>
    </ModeProvider>
  )
}
