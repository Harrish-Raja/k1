import { createContext, useContext, useEffect, useState } from 'react'

const ModeContext = createContext({ tech: false, setTech: () => {} })

export function ModeProvider({ children }) {
  const [tech, setTechState] = useState(() => {
    try { return localStorage.getItem('bw-tech') === '1' } catch { return false }
  })
  const setTech = (v) => {
    setTechState(v)
    try { localStorage.setItem('bw-tech', v ? '1' : '0') } catch { /* storage blocked */ }
  }
  useEffect(() => { document.documentElement.dataset.mode = tech ? 'tech' : 'plain' }, [tech])
  return <ModeContext.Provider value={{ tech, setTech }}>{children}</ModeContext.Provider>
}

export const useMode = () => useContext(ModeContext)

/** Renders only when "Technical detail" is switched on. */
export function Tech({ children }) {
  const { tech } = useMode()
  return tech ? children : null
}

/** Renders only in plain mode. */
export function Plain({ children }) {
  const { tech } = useMode()
  return tech ? null : children
}
