export default function Loading() {
  return (
    <div className="flex h-svh w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-600">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600" />
        <p>Laster stasjoner…</p>
      </div>
    </div>
  )
}
