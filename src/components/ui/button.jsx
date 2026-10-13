import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gold-300 disabled:pointer-events-none disabled:opacity-50', {
  variants: { variant: {
    default: 'bg-green-800 text-white shadow-sm hover:bg-green-900',
    secondary: 'border border-green-200 bg-white text-green-900 hover:bg-green-50',
    gold: 'bg-gold-500 text-green-950 hover:bg-gold-600',
    ghost: 'text-green-900 hover:bg-green-50',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  }, size: { default: 'h-11', sm: 'min-h-9 px-4 text-xs', lg: 'min-h-13 px-7 text-base', icon: 'size-11 p-0' } },
  defaultVariants: { variant: 'default', size: 'default' },
})

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
