import { useState } from "react"
import { toast } from "sonner"

export const useCopyToClipboard = () => {
    const [copied, setCopied] = useState(false)

    const handler = (text: string) => {
        try{
            navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success('Copied to clipboard')
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch(err) {
            toast.error('Failed to copy to clipboard')
        }
    }

    return { copied, handler }
}