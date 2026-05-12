'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  c: {
    bg: string
    bgAlt: string
    bgCard: string
    bgCardHover: string
    bgInput: string
    border: string
    borderInput: string
    text: string
    textSecondary: string
    textMuted: string
    textFaint: string
    navBg: string
    dropdownBg: string
    sectionAlt: string
  }
}

const dark = {
  bg: 'linear-gradient(to bottom, #0a0a0a, #0f1318)',
  bgAlt: 'rgba(13,13,13,0.95)',
  bgCard: 'rgba(255,255,255,0.03)',
  bgCardHover: 'rgba(255,255,255,0.06)',
  bgInput: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  borderInput: 'rgba(255,255,255,0.12)',
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.5)',
  textMuted: 'rgba(255,255,255,0.35)',
  textFaint: 'rgba(255,255,255,0.2)',
  navBg: 'rgba(10,10,10,0.92)',
  dropdownBg: '#111111',
  sectionAlt: '#0d0d0d',
}

const light = {
  bg: 'linear-gradient(to bottom, #f0ede8, #e8e4dd)',
  bgAlt: 'rgba(0,0,0,0.03)',
  bgCard: 'rgba(0,0,0,0.04)',
  bgCardHover: 'rgba(0,0,0,0.07)',
  bgInput: 'rgba(0,0,0,0.05)',
  border: 'rgba(0,0,0,0.09)',
  borderInput: 'rgba(0,0,0,0.12)',
  text: '#111111',
  textSecondary: 'rgba(0,0,0,0.5)',
  textMuted: 'rgba(0,0,0,0.4)',
  textFaint: 'rgba(0,0,0,0.25)',
  navBg: 'rgba(240,237,232,0.92)',
  dropdownBg: '#ffffff',
  sectionAlt: '#e8e4dd',
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  c: dark,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('nodable_theme') as Theme | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.style.background = theme === 'dark' ? '#080808' : '#f0ede8'
    document.body.style.color = theme === 'dark' ? '#fff' : '#111'
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('nodable_theme', next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, c: theme === 'dark' ? dark : light }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
