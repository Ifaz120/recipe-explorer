import { useState, useEffect } from "react"
import { Search, UtensilsCrossed, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import MealCard from "@/components/MealCard"

const API = "https://www.themealdb.com/api/json/v1/1"

// Remember the last search/category so "Back" from a recipe returns to the same list
function getSaved() {
  return JSON.parse(sessionStorage.getItem("home") || "{}")
}

export default function Home() {
  // useState: the text currently typed in the search box
  const [query, setQuery] = useState("")
  // useState: the search term we actually searched for (changes when the form is submitted)
  const [searchTerm, setSearchTerm] = useState(() => getSaved().searchTerm ?? "chicken")
  // useState: the category chip that is selected ("" means none)
  const [selectedCategory, setSelectedCategory] = useState(() => getSaved().selectedCategory ?? "")
  // useState: the list of categories for the chips
  const [categories, setCategories] = useState([])
  // useState: the meals shown in the grid
  const [meals, setMeals] = useState([])
  // useState: true while we wait for the API
  const [loading, setLoading] = useState(true)
  // useState: holds an error message if a fetch fails
  const [error, setError] = useState("")
  // useState: a counter we bump to re-run the fetch when "Try again" is clicked
  const [retry, setRetry] = useState(0)

  // useEffect with [] runs once, when the page first appears: load the categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API}/categories.php`)
        const data = await res.json()
        setCategories(data.categories)
      } catch {
        // Chips are optional, so the page still works without them
        setCategories([])
      }
    }
    loadCategories()
  }, [])

  // useEffect runs again whenever selectedCategory or searchTerm changes: load the meals
  useEffect(() => {
    // "ignore" stops an old, slow response from replacing a newer one
    let ignore = false

    async function loadMeals() {
      setLoading(true)
      setError("")
      try {
        // A selected category wins; otherwise search by name
        const url = selectedCategory
          ? `${API}/filter.php?c=${encodeURIComponent(selectedCategory)}`
          : `${API}/search.php?s=${encodeURIComponent(searchTerm)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Bad response")
        const data = await res.json()
        // The API returns { meals: null } when nothing matches
        if (!ignore) setMeals(data.meals || [])
      } catch {
        if (!ignore) setError("We couldn't load recipes. Check your connection and try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadMeals()

    // Cleanup: runs before the next effect, marking this request as outdated
    return () => {
      ignore = true
    }
  }, [selectedCategory, searchTerm, retry])

  // useEffect: save the current choice so it survives going to a recipe and back
  useEffect(() => {
    sessionStorage.setItem("home", JSON.stringify({ searchTerm, selectedCategory }))
  }, [searchTerm, selectedCategory])

  function handleSearch(e) {
    e.preventDefault() // stop the form from reloading the page
    const term = query.trim()
    if (!term) return
    setSelectedCategory("")
    setSearchTerm(term)
  }

  function handleCategory(name) {
    setQuery("")
    setSelectedCategory(name)
  }

  const heading = selectedCategory || `Results for “${searchTerm}”`

  return (
    <>
      {/* Hero */}
      <section className="rise mx-auto max-w-3xl px-5 pt-12 pb-8 text-center sm:pt-16">
        <h1 className="bg-gradient-to-b from-white to-[#a1a1a6] bg-clip-text text-5xl leading-[1.12] font-semibold text-transparent sm:text-7xl">
          What are we cooking tonight?
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground sm:text-xl">
          Search thousands of recipes, or browse by category.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-9 flex max-w-xl gap-2 rounded-full bg-[#1c1c1e] p-1.5 ring-1 ring-white/10 transition-shadow focus-within:ring-3 focus-within:ring-primary/30">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try pasta, curry or pancakes"
              aria-label="Search recipes"
              className="h-11 rounded-full border-0 bg-transparent pl-11 text-base shadow-none ring-0 focus-visible:ring-0 md:text-base"
            />
          </div>
          <Button type="submit" className="h-11 rounded-full px-6 text-[15px] hover:bg-primary/90 active:scale-95">
            Search
          </Button>
        </form>
      </section>

      {/* Category chips */}
      <section className="mx-auto max-w-6xl px-5" aria-label="Categories">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {categories.length === 0
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />)
            : categories.map((c) => {
                const active = selectedCategory === c.strCategory
                return (
                  <button
                    key={c.idCategory}
                    onClick={() => handleCategory(c.strCategory)}
                    aria-pressed={active}
                    className={`h-9 shrink-0 rounded-full px-4 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-primary/40 active:scale-95 ${
                      active
                        ? "bg-white text-black"
                        : "bg-[#1c1c1e] text-foreground hover:bg-[#2c2c2e]"
                    }`}
                  >
                    {c.strCategory}
                  </button>
                )
              })}
        </div>
      </section>

      {/* Meals */}
      <section className="mx-auto mt-10 max-w-6xl px-5">
        <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">{heading}</h2>

        {error ? (
          <Message icon={<WifiOff />} title="Something went wrong" text={error}>
            <Button onClick={() => setRetry((n) => n + 1)} variant="secondary" className="mt-5 h-10 rounded-full px-5">
              Try again
            </Button>
          </Message>
        ) : loading ? (
          <Grid>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[26px] bg-[#1c1c1e]">
                <Skeleton className="aspect-[4/5] rounded-none bg-[#2c2c2e]" />
              </div>
            ))}
          </Grid>
        ) : meals.length === 0 ? (
          <Message icon={<UtensilsCrossed />} title="No recipes found" text="Try a different word, or pick a category above." />
        ) : (
          <Grid>
            {meals.map((meal) => (
              <MealCard key={meal.idMeal} meal={meal} category={selectedCategory} />
            ))}
          </Grid>
        )}
      </section>
    </>
  )
}

// 1 column on mobile, 2 on tablet, 3 on laptop, 4 on large screens
function Grid({ children }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
}

// Friendly message for empty and error states
function Message({ icon, title, text, children }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center py-16 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#1c1c1e] text-primary [&_svg]:size-6">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-1.5 text-muted-foreground">{text}</p>
      {children}
    </div>
  )
}
