# Recipe Explorer

A small React app for searching and browsing recipes, built for a class assignment. It uses the free [TheMealDB](https://www.themealdb.com/api.php) API (no API key needed). The interface follows Apple's dark design style (like Apple TV and Music): true-black background, one pink-red accent, photo-first cards, a translucent navbar, grouped lists and large tight typography.

## Features

- Search recipes by name
- Browse recipes by category (chips load from the API)
- Recipe cards with image, name and category badge; hover lift effect
- Details page with large image, category and area badges, ingredients with measures, numbered steps and a YouTube link
- Skeleton loaders, a friendly "no results" message and an error message with retry
- The last search/category is remembered when you press Back from a recipe
- Responsive grid: 1 column on mobile, 2 on tablet, 3–4 on desktop
- 404 page with a button back home

## Hooks used and where

| Hook | File | What it does |
| --- | --- | --- |
| `useState` | `pages/Home.jsx` | search input text, submitted search term, selected category, categories list, meals list, loading, error, retry counter |
| `useState` | `pages/MealDetails.jsx` | single meal, loading, error |
| `useEffect` | `pages/Home.jsx` | fetch categories once on mount |
| `useEffect` | `pages/Home.jsx` | fetch meals whenever the selected category or search term changes |
| `useEffect` | `pages/MealDetails.jsx` | fetch the meal whenever the `:id` in the URL changes |
| `useNavigate` | `components/MealCard.jsx` | go to `/meal/:id` when a card is clicked |
| `useNavigate` | `pages/MealDetails.jsx` | `navigate(-1)` for the Back button |
| `useNavigate` | `pages/NotFound.jsx` | `navigate("/")` to return home |

`useParams` (also from react-router-dom) reads the `:id` from the URL.

## Tech stack

- React 19 + Vite (JavaScript/JSX)
- React Router (`react-router-dom`)
- Tailwind CSS v4
- shadcn/ui components: Button, Input, Card, Badge, Skeleton
- lucide-react icons
- Plain `fetch` with `async/await`

## Project structure

```
src/
  main.jsx              BrowserRouter + app mount
  App.jsx               routes: "/", "/meal/:id", "*"
  pages/                Home.jsx, MealDetails.jsx, NotFound.jsx
  components/           Navbar.jsx, MealCard.jsx, Footer.jsx
  components/ui/        shadcn/ui components
  lib/utils.js          cn() class-name helper
```

The `@` alias points to `src/` (set in `vite.config.js` and `jsconfig.json`), so imports look like `@/components/Navbar`.

## Run locally

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
```
