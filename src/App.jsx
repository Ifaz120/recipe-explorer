import { Routes, Route } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Home from "@/pages/Home"
import MealDetails from "@/pages/MealDetails"
import NotFound from "@/pages/NotFound"

// App defines the page layout (navbar + page + footer) and maps URLs to pages
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meal/:id" element={<MealDetails />} />
          {/* "*" matches any URL that no other route matched */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
