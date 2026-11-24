import { Link } from "react-router-dom"
import { ChefHat } from "lucide-react"

// Sticky, translucent top bar. Clicking the logo goes back to the home page.
export default function Navbar() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-5">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg text-[17px] font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
        >
          <span className="grid size-7 place-items-center rounded-[9px] bg-primary text-primary-foreground">
            <ChefHat className="size-4" />
          </span>
          Recipe Explorer
        </Link>
      </div>
    </header>
  )
}
