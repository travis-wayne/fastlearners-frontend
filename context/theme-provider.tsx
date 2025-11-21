import { createContext, useContext, useEffect, useState, useMemo, useCallback, startTransition } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME = 'system'
const THEME_COOKIE_NAME = 'vite-ui-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: 'light',
  theme: DEFAULT_THEME,
  setTheme: () => null,
  resetTheme: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(
    () => (getCookie(storageKey) as Theme) || defaultTheme
  )
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light'
    const initialTheme = (getCookie(storageKey) as Theme) || defaultTheme
    if (initialTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return initialTheme as ResolvedTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(() => {
        root.classList.remove('light', 'dark')
        root.classList.add(currentResolvedTheme)
      })
    }

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(systemTheme)
        applyTheme(systemTheme)
      } else {
        const newResolvedTheme = theme as ResolvedTheme
        setResolvedTheme(newResolvedTheme)
        applyTheme(newResolvedTheme)
      }
    }

    updateResolvedTheme()

    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((theme: Theme) => {
    // Use startTransition to mark this as non-urgent update
    startTransition(() => {
      _setTheme(theme)
    })
    // Defer cookie operation to avoid blocking UI
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE)
      })
    } else {
      setTimeout(() => {
        setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE)
      }, 0)
    }
  }, [storageKey])

  const resetTheme = useCallback(() => {
    startTransition(() => {
      _setTheme(DEFAULT_THEME)
    })
    // Defer cookie operation to avoid blocking UI
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        removeCookie(storageKey)
      })
    } else {
      setTimeout(() => {
        removeCookie(storageKey)
      }, 0)
    }
  }, [storageKey])

  const contextValue = useMemo(
    () => ({
      defaultTheme,
      resolvedTheme,
      resetTheme,
      theme,
      setTheme,
    }),
    [defaultTheme, resolvedTheme, theme]
  )

  return (
    <ThemeContext.Provider value={contextValue} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
