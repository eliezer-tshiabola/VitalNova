import { cn } from '../../lib/utils'

export function Input({ className, ...props }) {
  return <input className={cn('h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-green-700 focus:ring-3 focus:ring-green-100', className)} {...props} />
}
