import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

// Shown for any URL that doesn't match a route
export default function NotFound() {
  // useNavigate: send the user back to the home page with a button click
  const navigate = useNavigate()

  return (
    <section className="rise mx-auto flex max-w-md flex-col items-center px-5 py-28 text-center">
      <p className="bg-gradient-to-b from-white to-[#6e6e73] bg-clip-text text-9xl leading-none font-semibold tracking-tighter text-transparent">404</p>
      <h1 className="mt-4 text-3xl font-semibold">This page isn't on the menu</h1>
      <p className="mt-2 text-lg text-muted-foreground">The link may be broken, or the page may have moved.</p>
      <Button onClick={() => navigate("/")} className="mt-8 h-11 rounded-full px-6 text-[15px] hover:bg-primary/90">
        Back to recipes
      </Button>
    </section>
  )
}
