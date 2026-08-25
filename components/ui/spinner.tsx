interface SpinnerProps {
  size?: number
}

export default function Spinner({ size = 32 }: SpinnerProps) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${size / 8}px`,
      }}
      className="animate-spin rounded-full border-primary border-t-background"
    />
  )
}
