import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavbarComponent } from "./components/NavbarComponent";
import { ExplorePage } from "./components/ExplorePage";
import { FavoritesPage } from "./components/FavoritesPage";

const App: React.FC = () => {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/categories" element={<ExplorePage />} />
        <Route path="/my-recipes" element={<ExplorePage />} />
      </Routes>
    </Router>
  );
};

export default App;
