type DividerProps = {
  text: string
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-2">
      <span className="flex-1 h-px bg-[var(--color-input-border)]" />
      <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">{text}</span>
      <span className="flex-1 h-px bg-[var(--color-input-border)]" />
    </div>
  )
}
