import { useState } from "react"
import Shop from "./components/Shop"
import TurboC3Simulator from "./components/TurboC3Simulator"

const PAGES = [
  { id: "shop", label: "🛒 Shop" },
  { id: "turboc3", label: "🖥️ CG Simulator (TurboC3)" },
]

const App = () => {
  const [page, setPage] = useState("shop")

  return (
    <div>
      <nav className="flex gap-2 bg-gray-800 px-4 py-2">
        {PAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPage(p.id)}
            className={`px-4 py-1.5 rounded text-sm font-semibold transition ${
              page === p.id
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {p.label}
          </button>
        ))}
      </nav>

      {page === "shop" && <Shop />}
      {page === "turboc3" && <TurboC3Simulator />}
    </div>
  )
}

export default App
