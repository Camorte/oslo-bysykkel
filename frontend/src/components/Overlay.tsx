function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span>
      <i
        className="mr-1.5 inline-block h-3 w-3 rounded-full align-middle"
        style={{ background: color }}
      />{' '}
      {label}
    </span>
  )
}

export default function Overlay() {
  return (
    <div className="absolute top-3 right-3 z-[1000] rounded-lg bg-white/90 px-4 py-3 shadow-md">
      <header>
        <h1 className="m-0 text-3xl font-semibold">Oslo Bysykkel</h1>
        <p className="mt-0.5 text-sm text-gray-600">
          Ledige sykler og låser akkurat nå
        </p>
      </header>

      <div className="mt-2.5 grid gap-1.5 border-t border-gray-300 pt-2.5 text-sm">
        <LegendDot color="#27ae60" label="Ledige sykler" />
        <LegendDot color="#c0392b" label="Ingen sykler" />
      </div>
    </div>
  )
}
