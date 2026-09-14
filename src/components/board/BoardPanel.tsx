export function BoardPanel({ children, padded = true, className = '' }: { children: React.ReactNode, padded?: boolean, className?: string }) {
  return (
    <div className={`bg-enamel border-inset border-seam rounded-panel ${padded ? 'p-panel' : ''} ${className}`}>
      {children}
    </div>
  )
}
