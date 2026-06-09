type DividerProps = {
  text: string
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-2">
      <span className="flex-1 h-px bg-input-border" />
      <span className="text-xs text-text-muted whitespace-nowrap">{text}</span>
      <span className="flex-1 h-px bg-input-border" />
    </div>
  )
}
