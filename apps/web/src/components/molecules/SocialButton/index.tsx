type SocialButtonProps = {
  src: string
  alt: string
  label: string
  onClick?: () => void
}

export function SocialButton({ src, alt, label, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-[var(--color-input-bg)] transition cursor-pointer"
    >
      <img src={src} alt={alt} className="w-8 h-8 object-contain" />
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
    </button>
  )
}
