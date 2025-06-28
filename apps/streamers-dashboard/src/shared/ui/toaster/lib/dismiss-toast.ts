import { toast } from 'sonner'

export const closeAllToasts = () => {
  return toast.dismiss()
}

export const closeToast = (toastId: string | number) => {
  return toast.dismiss(toastId)
}
