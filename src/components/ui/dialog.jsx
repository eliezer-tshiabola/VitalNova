import * as DialogPrimitive from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { cn } from '../../lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({ className, children, ...props }) {
  return <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-green-950/55 backdrop-blur-[2px] data-[state=open]:animate-in" />
    <DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl focus:outline-none sm:p-8', className)} {...props}>
      {children}
      <DialogPrimitive.Close aria-label="Fermer" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"><FontAwesomeIcon icon={faXmark} /></DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
}

export const DialogTitle = ({ className, ...props }) => <DialogPrimitive.Title className={cn('font-display text-2xl font-bold text-green-950', className)} {...props} />
export const DialogDescription = ({ className, ...props }) => <DialogPrimitive.Description className={cn('mt-2 text-sm leading-6 text-stone-600', className)} {...props} />
