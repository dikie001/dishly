import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Loader } from "./components/Loaders";

// Lazy load pages
const HomePage = lazy(() => import("./pages/HomePage"));
const RecipeDetailPage = lazy(() =>
  import("./pages/RecipeDetailPage").then((m) => ({
    default: m.RecipeDetailPage,
  })),
);
const FavoritesPage = lazy(() =>
  import("./pages/FavoritesPage").then((m) => ({ default: m.FavoritesPage })),
);
const CategoriesPage = lazy(() =>
  import("./pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader size="lg" text="Loading..." />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;
