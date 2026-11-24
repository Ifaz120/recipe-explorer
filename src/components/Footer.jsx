// Small footer with a credit for the data source
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-8 text-center text-xs text-muted-foreground">
      Recipes from{" "}
      <a
        href="https://www.themealdb.com"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        TheMealDB
      </a>
      . Built with React, Tailwind CSS and shadcn/ui.
    </footer>
  )
}
