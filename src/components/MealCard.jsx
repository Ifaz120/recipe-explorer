import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// One recipe card: the photo fills the card and the text sits on top of it.
// "category" is passed in because the category-filter API doesn't include it.
export default function MealCard({ meal, category }) {
  // useNavigate gives us a function to change the page from code
  const navigate = useNavigate()

  const goToDetails = () => navigate(`/meal/${meal.idMeal}`)

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(e) => e.key === "Enter" && goToDetails()}
      className="group/card relative aspect-[4/5] cursor-pointer gap-0 rounded-[26px] border-0 bg-[#1c1c1e] p-0 ring-1 ring-white/10 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:ring-3 focus-visible:ring-primary active:scale-[0.98] active:duration-100 [@media(hover:hover)]:hover:-translate-y-1.5 [@media(hover:hover)]:hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.9)]"
    >
      <img
        src={meal.strMealThumb + "/medium"}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
      />
      {/* dark fade so the text stays readable on any photo */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2.5 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 pt-24">
        {(category || meal.strCategory) && (
          <Badge className="bg-white/20 text-white backdrop-blur-md">{category || meal.strCategory}</Badge>
        )}
        <h3 className="line-clamp-2 text-xl leading-tight font-semibold text-white">{meal.strMeal}</h3>
      </div>
    </Card>
  )
}
