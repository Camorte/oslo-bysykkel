export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex h-svh w-full items-center justify-center p-6">
      <div className="max-w-sm rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-3xl">⚠️</p>
        <h2 className="mt-2 font-semibold text-red-800">
          Kunne ikke laste stasjoner
        </h2>
        <p className="mt-1 text-sm text-red-700">{message}</p>
        <button
          onClick={onRetry}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Prøv igjen
        </button>
      </div>
    </div>
  )
}
