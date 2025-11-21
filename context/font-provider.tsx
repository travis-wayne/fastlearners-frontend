import { createContext, useContext, useEffect, useState, useMemo, useCallback, startTransition } from 'react'
import { fonts } from '@/config/fonts'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Font = (typeof fonts)[number]

const FONT_COOKIE_NAME = 'font'
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type FontContextType = {
  font: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextType | null>(null)

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, _setFont] = useState<Font>(() => {
    const savedFont = getCookie(FONT_COOKIE_NAME)
    return fonts.includes(savedFont as Font) ? (savedFont as Font) : fonts[0]
  })

  useEffect(() => {
    const applyFont = (font: string) => {
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(() => {
        const root = document.documentElement
        // More efficient: track previous font class instead of iterating all classes
        const prevFontClass = root.dataset.fontClass
        if (prevFontClass) {
          root.classList.remove(prevFontClass)
        }
        const newFontClass = `font-${font}`
        root.classList.add(newFontClass)
        root.dataset.fontClass = newFontClass
      })
    }

    applyFont(font)
  }, [font])

  const setFont = useCallback((font: Font) => {
    // Use startTransition to mark this as non-urgent update
    startTransition(() => {
      _setFont(font)
    })
    // Defer cookie operation to avoid blocking UI
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        setCookie(FONT_COOKIE_NAME, font, FONT_COOKIE_MAX_AGE)
      })
    } else {
      setTimeout(() => {
        setCookie(FONT_COOKIE_NAME, font, FONT_COOKIE_MAX_AGE)
      }, 0)
    }
  }, [])

  const resetFont = useCallback(() => {
    startTransition(() => {
      _setFont(fonts[0])
    })
    // Defer cookie operation to avoid blocking UI
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        removeCookie(FONT_COOKIE_NAME)
      })
    } else {
      setTimeout(() => {
        removeCookie(FONT_COOKIE_NAME)
      }, 0)
    }
  }, [])

  const contextValue = useMemo(
    () => ({ font, setFont, resetFont }),
    [font, setFont, resetFont]
  )

  return (
    <FontContext.Provider value={contextValue}>
      {children}
    </FontContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}
