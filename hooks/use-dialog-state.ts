import { useState } from 'react'

/**
 * Hook for managing dialog open/close state
 * Returns [open, setOpen] where open is a boolean
 */
export default function useDialogState(
  initialValue: boolean = false
): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(initialValue)
  return [open, setOpen]
}

