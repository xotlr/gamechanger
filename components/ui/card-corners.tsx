interface Props {
  color?: string
  size?: 'sm' | 'md'
}

export function CardCorners({ color = '#ff0057', size = 'md' }: Props) {
  const s = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'

  return (
    <>
      <span className={`absolute top-0 left-0 ${s} border-t-2 border-l-2`} style={{ borderColor: color }} />
      <span className={`absolute top-0 right-0 ${s} border-t-2 border-r-2`} style={{ borderColor: color }} />
      <span className={`absolute bottom-0 left-0 ${s} border-b-2 border-l-2`} style={{ borderColor: color }} />
      <span className={`absolute bottom-0 right-0 ${s} border-b-2 border-r-2`} style={{ borderColor: color }} />
    </>
  )
}
