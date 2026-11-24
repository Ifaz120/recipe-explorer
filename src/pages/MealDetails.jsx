import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Play, WifiOff, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const API = "https://www.themealdb.com/api/json/v1/1"

// TheMealDB stores ingredients as strIngredient1..20 and strMeasure1..20.
// This joins each pair and skips the empty ones.
function getIngredients(meal) {
  const list = []
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim()
    const measure = meal[`strMeasure${i}`]?.trim()
    if (name) list.push({ name, measure })
  }
  return list
}

// Turn the instructions text into one step per line (dropping "STEP 1" style lines)
function getSteps(text = "") {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    // keep only lines with real text (skips blank lines, odd symbols and "STEP 1" labels)
    .filter((line) => /[\p{L}\p{N}]/u.test(line) && !/^(step\s*)?\d+\.?$/i.test(line))
}

export default function MealDetails() {
  // useParams reads :id from the URL (/meal/:id)
  const { id } = useParams()
  // useNavigate lets us go back to the previous page
  const navigate = useNavigate()

  // useState: the single meal we are showing
  const [meal, setMeal] = useState(null)
  // useState: loading and error flags
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // useEffect runs whenever the :id in the URL changes: load that meal
  useEffect(() => {
    let ignore = false

    async function loadMeal() {
      setLoading(true)
      setError("")
      setMeal(null)
      try {
        const res = await fetch(`${API}/lookup.php?i=${encodeURIComponent(id)}`)
        if (!res.ok) throw new Error("Bad response")
        const data = await res.json()
        if (!ignore) setMeal(data.meals ? data.meals[0] : null)
      } catch {
        if (!ignore) setError("We couldn't load this recipe. Check your connection and try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadMeal()

    return () => {
      ignore = true
    }
  }, [id])

  const ingredients = meal ? getIngredients(meal) : []
  const steps = meal ? getSteps(meal.strInstructions) : []

  return (
    <div className="relative isolate overflow-x-clip">
      {/* Ambient glow: a blurred copy of the photo behind the page, fading to black */}
      {meal && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80vh] [mask-image:linear-gradient(to_bottom,black,transparent)]">
          <img src={meal.strMealThumb + "/small"} alt="" className="size-full scale-150 object-cover opacity-40 blur-[80px] saturate-150" />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-5 pt-6 pb-4">
      {/* navigate(-1) = same as the browser's back button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="-ml-3 h-10 rounded-full pr-4 pl-2 text-[15px] text-primary hover:bg-white/10"
      >
        <ChevronLeft className="size-5" />
        Back
      </Button>

      {loading && <DetailsSkeleton />}

      {!loading && error && (
        <Notice icon={<WifiOff />} title="Something went wrong" text={error}>
          <Button onClick={() => navigate(0)} variant="secondary" className="mt-5 h-10 rounded-full px-5">
            Reload
          </Button>
        </Notice>
      )}

      {!loading && !error && !meal && (
        <Notice icon={<UtensilsCrossed />} title="Recipe not found" text="This recipe doesn't exist or was removed.">
          <Button onClick={() => navigate("/")} className="mt-5 h-10 rounded-full px-5">
            Browse recipes
          </Button>
        </Notice>
      )}

      {meal && (
        <article className="rise mt-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="aspect-square w-full rounded-[2rem] object-cover ring-1 ring-white/10 lg:sticky lg:top-24 lg:self-start"
            />

            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="h-6 bg-white/15 px-3 text-sm text-white backdrop-blur-md">{meal.strCategory}</Badge>
                <Badge variant="secondary" className="h-6 bg-white/10 px-3 text-sm text-[#d1d1d6]">{meal.strArea}</Badge>
              </div>
              <h1 className="mt-4 text-4xl leading-[1.1] font-semibold sm:text-5xl">{meal.strMeal}</h1>

              {meal.strYoutube && (
                <Button
                  nativeButton={false}
                  render={<a href={meal.strYoutube} target="_blank" rel="noreferrer" />}
                  className="mt-6 h-11 rounded-full px-6 text-[15px] hover:bg-primary/90"
                >
                  <Play className="size-4 fill-current" />
                  Watch on YouTube
                </Button>
              )}

              <h2 className="mt-10 mb-4 text-2xl font-semibold">Ingredients</h2>
              <Card className="gap-0 rounded-3xl border-0 bg-[#1c1c1e]/90 p-2 ring-1 ring-white/10 backdrop-blur-xl">
                <ul>
                  {ingredients.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-4 border-b border-white/10 px-4 py-3 last:border-0"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-right text-muted-foreground">{item.measure}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <section className="mx-auto mt-14 max-w-2xl">
            <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Instructions</h2>
            <ol className="space-y-6">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="text-[17px] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </article>
      )}
      </div>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-14">
      <Skeleton className="aspect-square w-full rounded-[2rem]" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-11 w-48 rounded-full" />
        <Skeleton className="mt-8 h-64 w-full rounded-3xl" />
      </div>
    </div>
  )
}

function Notice({ icon, title, text, children }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center py-20 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#1c1c1e] text-primary [&_svg]:size-6">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1.5 text-muted-foreground">{text}</p>
      {children}
    </div>
  )
}
