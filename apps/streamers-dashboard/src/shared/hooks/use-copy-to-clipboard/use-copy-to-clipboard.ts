import { useCallback, useState } from 'react'

export const useCopyToClipboard = (text?: string) => {
  const [copiedText, setCopiedText] = useState<NullablePossible<string>>(
    text ?? null
  )

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
  }, [])

  return { copiedText, copyToClipboard }
}
